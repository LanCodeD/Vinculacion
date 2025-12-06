import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const usuario = await getSessionUser();

    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const id = Number(params.id);
    const body = await req.json();

    const contactoActualizado = await prisma.contactos.update({
      where: { id_contactos: id },
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        correo: body.correo,
        puesto: body.puesto,
        titulo: body.titulo,
        empresas_id: body.empresas_id,
        grupos_id: body.grupos_id || null,
        es_representante: body.es_representante ?? 0,
        actualizado_en: new Date(),
      },
      select: {
        id_contactos: true,
        nombre: true,
        apellido: true,
        correo: true,
        puesto: true,
        titulo: true,
        empresas: { select: { id_empresas: true, nombre_comercial: true } },
        grupos: { select: { id_grupos: true, nombre_grupo: true } },
        contacto_estados: { select: { nombre_estado: true } },
        creado_en: true,
        actualizado_en: true,
      },
    });

    return NextResponse.json(contactoActualizado, { status: 200 });
  } catch (error) {
    console.error("❌ Error al actualizar contacto:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
