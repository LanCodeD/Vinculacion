import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { usuarioId, codigoVerificacion } = await req.json();

    // Capturamos info del cliente
    const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";
    const userAgent = req.headers.get("user-agent") || "desconocido";

    // Buscar token válido en DB
    const token = await prisma.tokens_usuarios.findFirst({
      where: {
        usuarios_id: usuarioId,
        tipo: "verificacion", // 👈 mismo que al crearlo
        usado_en: null,
        expiracion_en: { gt: new Date() },
      },
      orderBy: { creado_en: "desc" }, // último token emitido
    });

    if (!token) {
      return NextResponse.json(
        { error: "No se encontró un código válido o ya expiró" },
        { status: 400 }
      );
    }

    // Hash del código enviado por el usuario
    const hashIngresado = crypto
      .createHash("sha256")
      .update(codigoVerificacion)
      .digest("hex");

    if (token.intentos >= 5) {
      return NextResponse.json(
        { error: "Demasiados intentos. Solicita un nuevo código." },
        { status: 400 }
      );
    }

    if (hashIngresado !== token.token_hash) {
      // Incrementar intentos fallidos
      await prisma.tokens_usuarios.update({
        where: { id_token: token.id_token },
        data: { intentos: { increment: 1 } },
      });

      return NextResponse.json(
        { error: "El código es incorrecto" },
        { status: 400 }
      );
    }

    // Marcar token como usado
    await prisma.tokens_usuarios.update({
      where: { id_token: token.id_token },
      data: {
        usado_en: new Date(),
        ip_origen: ip,
        user_agent: userAgent,
      },
    });

    // Actualizar usuario como verificado
    await prisma.usuarios.update({
      where: { id_usuarios: usuarioId },
      data: {
        correo_verificado: 1,
        correo_verificado_en: new Date(),
        paso_actual: 3,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error en verificación:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
