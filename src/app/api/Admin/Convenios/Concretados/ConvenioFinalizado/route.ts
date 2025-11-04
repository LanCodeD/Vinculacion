import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const usuario = await getSessionUser();

    // Validar rol del usuario
    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const solicitudes = await prisma.solicitud_convenios.findMany({
      where: {
        estado_id: 6,
        convenio_concretado: {
          is: null, // 👈 Solo las solicitudes que NO tienen convenio
        },
      },
      orderBy: { created_at: "desc" },
      select: {
        id_solicitud: true,
        estado: {
          select: { id_estado: true, nombre_estado: true },
        },
      },
    });

    return NextResponse.json(solicitudes);
  } catch (error) {
    console.error("Error al listar convenios:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
