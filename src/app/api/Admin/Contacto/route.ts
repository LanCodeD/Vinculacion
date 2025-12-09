import { NextResponse } from "next/server";
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

    const contactos = await prisma.contactos.findMany({
      orderBy: { creado_en: "desc" },
      select: {
        id_contactos: true,
        nombre: true,
        apellido: true,
        correo: true,
        celular: true,
        puesto: true,
        titulo: true,
        empresas_id: true,
        grupos_id: true,
        es_representante: true,
        creado_en: true,
        contacto_estados: {
          select: {
            id_contacto_estados: true,
            nombre_estado: true,
          },
        },
        empresas: {
          select: {
            id_empresas: true,
            nombre_comercial: true, // 🔹 nombre de la empresa
          },
        },
        grupos: {
          select: {
            id_grupos: true,
            nombre_grupo: true, // 🔹 nombre del grupo
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

export async function POST(req: Request) {
  try {
    const usuario = await getSessionUser();

    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();

    const nuevoContacto = await prisma.contactos.create({
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        correo: body.correo,
        puesto: body.puesto,
        celular: body.celular,
        titulo: body.titulo,
        empresas_id: body.empresas_id, // viene del Select
        grupos_id: body.grupos_id || null, // opcional
        es_representante: body.es_representante ?? 0,
        contacto_estados_id: 1, // por defecto "Activo"
      },
      select: {
        id_contactos: true,
        nombre: true,
        apellido: true,
        correo: true,
        puesto: true,
        celular: true,
        titulo: true,
        empresas: { select: { id_empresas: true, nombre_comercial: true } },
        grupos: { select: { id_grupos: true, nombre_grupo: true } },
        contacto_estados: { select: { nombre_estado: true } },
        creado_en: true,
      },
    });

    return NextResponse.json(nuevoContacto, { status: 201 });
  } catch (error) {
    console.error("❌ Error al crear contacto:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
