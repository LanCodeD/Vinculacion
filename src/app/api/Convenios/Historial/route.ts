// app/api/Convenios/Historial/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const usuario = await getSessionUser();
    if (!usuario) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const solicitudes = await prisma.solicitud_convenios.findMany({
      where: { creado_por_usuario_id: usuario.id },
      select: {
        id_solicitud: true,
        creado_por_usuario_id: true,
        tipo_solicitud_id: true,
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(solicitudes);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
