import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { enviarCorreo } from "@/lib/mailer";

const MAXREENVIO = 3; // máximo de reenvíos permitidos
const COOLDOWN = [0, 60, 180]; // segundos de espera progresiva: 1º reenvío 0s, 2º 60s, 3º 180s

export async function POST(req: Request) {
  try {
    const { usuarioId } = await req.json();

    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuarios: usuarioId },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (usuario.correo_verificado) {
      return NextResponse.json(
        { error: "El correo ya fue verificado" },
        { status: 400 }
      );
    }

    // Obtener último token activo de verificación
    const token = await prisma.tokens_usuarios.findFirst({
      where: { usuarios_id: usuarioId, tipo: "verificacion", usado_en: null },
      orderBy: { creado_en: "desc" },
    });

    if (!token) {
      return NextResponse.json(
        { error: "No se encontró un token válido" },
        { status: 404 }
      );
    }

    // Verificar si excedió máximo de reenvíos
    if (token.reenvio >= MAXREENVIO) {
      return NextResponse.json(
        { error: "Has alcanzado el máximo de reenvíos permitidos por hoy" },
        { status: 400 }
      );
    }

    // Verificar cooldown progresivo
    const ahora = new Date();
    if (token.ultimo_envio) {
      const diffSegundos = (ahora.getTime() - token.ultimo_envio.getTime()) / 1000;
      const cooldownSeg = COOLDOWN[token.reenvio] ?? COOLDOWN[COOLDOWN.length - 1];
      if (diffSegundos < cooldownSeg) {
        return NextResponse.json(
          { error: `Debes esperar ${Math.ceil(cooldownSeg - diffSegundos)}s para reenviar` },
          { status: 400 }
        );
      }
    }

    // Generar nuevo código
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenHash = crypto.createHash("sha256").update(codigo).digest("hex");

    // Crear nuevo token con incremento de reenvío y fecha de último envío
    await prisma.tokens_usuarios.create({
      data: {
        usuarios_id: usuarioId,
        token_hash: tokenHash,
        tipo: "verificacion",
        expiracion_en: new Date(Date.now() + 15 * 60 * 1000),
        reenvio: token.reenvio + 1,
        ultimo_envio: ahora,
      },
    });

    // Mandar correo con código
    await enviarCorreo({
      to: usuario.correo,
      subject: "Nuevo código de verificación",
      html: `
        <p>Tu nuevo código de verificación es:</p>
        <h1 style="font-size:32px; letter-spacing:8px;">${codigo}</h1>
        <p>Este código expirará en 15 minutos.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error en reenvío:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
