import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const usuario = await getSessionUser();

    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const contactos = await prisma.contacto_estados.findMany({
      orderBy: { id_contacto_estados: "asc" },
      select: {
        id_contacto_estados: true,
        nombre_estado: true,
      },
    });

    return NextResponse.json(contactos);
  } catch (error) {
    console.error("Error al recuperar contactos:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
