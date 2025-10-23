import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ usuarioId: string }> }
) {
  try {
    const { usuarioId } = await context.params;
    const id = parseInt(usuarioId);

    const egresado = await prisma.egresados.findFirst({
      where: { usuarios_id: id },
      select: { cv_url: true },
    });

    if (!egresado) {
      return NextResponse.json({ ok: false, mensaje: "No es egresado" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      tieneCV: !!egresado.cv_url,
      cv_url: egresado.cv_url,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Error al obtener CV" }, { status: 500 });
  }
}
