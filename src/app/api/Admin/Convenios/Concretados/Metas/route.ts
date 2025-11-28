import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// ✅ Endpoint: obtener lista de opciones de firma de origen
export async function GET() {
  try {
    const usuario = await getSessionUser();

    // Validar rol del usuario
    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    const metas = await prisma.metas_convenios.findMany({
      select: {
        id_metas_convenios: true,
        nombre: true,
      },
      orderBy: { id_metas_convenios: "asc" },
    });

    return NextResponse.json(metas);
  } catch (error) {
    console.error("Error al obtener firmas de origen:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
