import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id_solicitud: string }> }
) {
  try {
    const { id_solicitud } = await params;
    const idNum = parseInt(id_solicitud);

    const solicitud = await prisma.solicitud_convenios.findMany({
      where: { id_solicitud: idNum },
      orderBy: { id_solicitud: "asc" },
      include: {
        detalle: true,
        estado: true,
        tipo: true,
        creador: {
          select: {
            nombre: true,
            correo: true,
          },
        },
      },
    });

    if (!solicitud || solicitud.length === 0) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(solicitud);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
