import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const registro = await prisma.tokens_usuarios.findFirst({
    where: {
      token_hash: tokenHash,
      tipo: "reset_password",
      usado_en: null,
      expiracion_en: { gt: new Date() },
    },
    orderBy: { creado_en: "desc" },
  });

  if (!registro) {
    return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.usuarios.update({
    where: { id_usuarios: registro.usuarios_id },
    data: { password_hash: hashedPassword },
  });

  await prisma.tokens_usuarios.update({
    where: { id_token: registro.id_token },
    data: { usado_en: new Date() },
  });

  return NextResponse.json({ ok: true });
}
