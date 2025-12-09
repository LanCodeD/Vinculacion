import {  NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const usuario = await getSessionUser();

    if (
      !usuario ||
      (usuario.role !== "Administrador" && usuario.role !== "Personal-Plantel")
    ) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const grupos = await prisma.grupos.findMany({
      orderBy: { creado_en: "desc" },
      select: {
        id_grupos: true,
        nombre_grupo: true,
        _count: {
          select: { contactos: true }, // 👈 cuenta contactos relacionados
        },
      },
    });

    return NextResponse.json(grupos);
  } catch (error) {
    console.error("Error al recuperar grupos:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
