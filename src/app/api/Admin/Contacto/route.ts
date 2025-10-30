import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const usuario = await getSessionUser();

    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const contactos = await prisma.contactos.findMany({
      orderBy: { creado_en: "desc" },
      select: {
        id_contactos: true,
        nombre: true,
        apellido: true,
        correo: true,
        puesto: true,
        titulo: true,
        empresas_id: true,
        grupos_id: true,
        es_representante: true,
        creado_en: true,
        contacto_estados: {
          select: {
            nombre_estado: true,
          },
        },
        empresas: {
          select: {
            nombre_comercial: true,
          },
        },
      },
    });

    return NextResponse.json(contactos);
  } catch (error) {
    console.error("Error al recuperar contactos:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
