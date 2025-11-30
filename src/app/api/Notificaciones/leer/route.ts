// api/Notificaciones/leer/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptionsCredencial";
import { prisma } from "@/lib/prisma";

export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  await prisma.notificaciones.updateMany({
    where: { usuarios_id: session.user.id, leido: false },
    data: { leido: true },
  });

  return NextResponse.json({ ok: true });
}
