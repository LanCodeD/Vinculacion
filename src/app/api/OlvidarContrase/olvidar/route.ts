import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { enviarCorreo } from "@/lib/mailer";
import { plantillaCorreoBase } from "@/lib/PlantillasCorreos/plantillaCorreoBase";

export async function POST(req: Request) {
  const { correo } = await req.json();

  const usuario = await prisma.usuarios.findUnique({ where: { correo } });
  if (!usuario || !usuario.password_hash) {
    // Mensaje genérico para no revelar si existe
    return NextResponse.json({ ok: true });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  await prisma.tokens_usuarios.create({
    data: {
      usuarios_id: usuario.id_usuarios,
      token_hash: tokenHash,
      tipo: "reset_password",
      expiracion_en: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  const resetLink = `${process.env.NEXTAUTH_URL}/IniciarSesion/Recuperar_Password?token=${token}`;
  const html = plantillaCorreoBase({
    titulo: "Recuperar contraseña",
    mensaje: `
    <p>Hola ${usuario.nombre} ${usuario.apellido},</p>
    <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para continuar.</p>
    <p>Este enlace expirará en 15 minutos.</p>
  `,
    botonTexto: "Restablecer contraseña",
    botonUrl: resetLink,
    colorPrimario: "#4f46e5", // Indigo, consistente con tu branding
  });

  await enviarCorreo({
    to: usuario.correo,
    subject: "Recupera tu contraseña",
    html,
  });

  return NextResponse.json({ ok: true });
}
