import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "20");

    const notificaciones = await prisma.notificaciones.findMany({
      where: { usuarios_id: session.user.id },
      orderBy: { creado_en: "desc" },
      skip,
      take,
    });

    return NextResponse.json({ ok: true, notificaciones });
  } catch (error) {
    console.error("❌ Error al obtener notificaciones:", error);
    return NextResponse.json({ ok: false, error: "Error al obtener notificaciones" }, { status: 500 });
  }
}
