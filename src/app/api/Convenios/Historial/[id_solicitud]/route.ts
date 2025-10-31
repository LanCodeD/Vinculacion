// app/api/Convenios/Historial/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const solicitud = await prisma.solicitud_convenios.findMany({
      where: { id_solicitud: id },
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

    if (!solicitud) {
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
