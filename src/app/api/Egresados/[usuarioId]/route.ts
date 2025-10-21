import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { usuarioId: string } }
) {
  try {
    const usuarioId = parseInt(params.usuarioId);
    const egresado = await prisma.egresados.findFirst({
      where: { usuarios_id: usuarioId },
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
