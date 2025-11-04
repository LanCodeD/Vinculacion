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

    // Consultar solicitudes con relaciones correctas
    const solicitudes = await prisma.solicitud_convenios.findMany({
      where: {
        tipo_solicitud_id: 1, // 👈 Aquí filtras por el valor deseado
      },
      orderBy: { created_at: "desc" },
      select: {
        id_solicitud: true,
        reviewed_at: true,
        fecha_solicitud: true,
        creador: {
          select: { nombre: true, correo: true },
        },
        estado: {
          select: { id_estado: true, nombre_estado: true },
        },
        revisor: {
          select: { nombre: true, correo: true }, // 👈 Aquí recuperas al administrador
        },
      },
    });

    return NextResponse.json(solicitudes);
  } catch (error) {
    console.error("Error al listar convenios:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
