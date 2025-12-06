import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const usuario = await getSessionUser();

    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const contactos = await prisma.grupos.findMany({
      orderBy: { creado_en: "desc" },
      select: {
        id_grupos: true,
        nombre_grupo: true,
      },
    });

    return NextResponse.json(contactos);
  } catch (error) {
    console.error("Error al recuperar contactos:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
