import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id_contactos: string }> }
) {
  try {
    const usuario = await getSessionUser();

    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id_contactos } = await context.params;
    const id = parseInt(id_contactos, 10);
    const body = await req.json();
    console.log("esto recupera del body frontend: ", body)

    const contactoActualizado = await prisma.contactos.update({
      where: { id_contactos: id },
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        correo: body.correo,
        puesto: body.puesto,
        celular: body.celular,
        titulo: body.titulo,
        empresas: { connect: { id_empresas: body.empresas_id } }, // 👈 relación
        grupos: body.grupos_id
          ? { connect: { id_grupos: body.grupos_id } }
          : { disconnect: true }, // 👈 opcional: desconectar si viene null
        contacto_estados: { connect: { id_contacto_estados: body.contacto_estados_id } }, // 👈 relación
        es_representante: body.es_representante ?? 0,
        actualizado_en: new Date(),
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
        contacto_estados: { select: { id_contacto_estados: true, nombre_estado:true } },
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
