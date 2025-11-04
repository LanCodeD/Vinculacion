import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id_solicitud: string }> }
) {
  const { id_solicitud } = await context.params;
  try {
    const usuario = await getSessionUser();
    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const id = parseInt(id_solicitud);
    if (Number.isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const solicitud = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
      include: {
        creador: { select: { nombre: true, correo: true } },
        estado: { select: { nombre_estado: true } },
      },
    });

    if (!solicitud)
      return NextResponse.json(
        { error: "No existe la solicitud" },
        { status: 404 }
      );

    const historial = await prisma.solicitud_estado_historial.findMany({
      where: { id_solicitud: id },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ solicitud, historial }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener solicitud admin:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id_solicitud: string }> }
) {
  try {
    const { id_solicitud } = await context.params;
    const usuario = await getSessionUser();

    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const id = parseInt(id_solicitud);
    if (isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    // Primero verificar si existe
    const existe = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
    });

    if (!existe) {
      return NextResponse.json(
        { error: "La solicitud no existe" },
        { status: 404 }
      );
    }

    await prisma.solicitud_convenios.delete({ where: { id_solicitud: id } });

    return NextResponse.json(
      { success: true, mensaje: "Solicitud eliminada correctamente ✅" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const mensaje =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Error al eliminar solicitud admin:", mensaje);
    return NextResponse.json(
      { error: "Error interno al eliminar la solicitud" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id_solicitud: string }> }
) {
  try {
    const { id_solicitud } = await context.params;
    const usuario = await getSessionUser();

    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const id = parseInt(id_solicitud);
    if (isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    // Verificar si la solicitud existe
    const solicitud = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
    });

    if (!solicitud) {
      return NextResponse.json(
        { error: "La solicitud no existe" },
        { status: 404 }
      );
    }

    // 🔹 Actualizar fecha, revisor y estado a FINALIZADO (6)
    const finalizada = await prisma.solicitud_convenios.update({
      where: { id_solicitud: id },
      data: {
        reviewed_at: new Date(), // fecha actual
        reviewed_by_user_id: usuario.id, // id del admin que finaliza
        estado_id: 6, // cambia a "FINALIZADO"
      },
      select: {
        id_solicitud: true,
        reviewed_at: true,
        estado: { select: { id_estado: true, nombre_estado: true } },
        revisor: { select: { nombre: true, correo: true } },
      },
    });

    await prisma.solicitud_estado_historial.create({
      data: {
        id_solicitud: id,
        estado_id: 6,
        cambiado_por_usuario_id: usuario.id,
        comentario: "Solicitud Finalizada correctamente",
      },
    });

    return NextResponse.json(
      {
        success: true,
        mensaje: "Solicitud finalizada correctamente 🟢",
        solicitud: finalizada,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const mensaje =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Error al finalizar solicitud admin:", mensaje);
    return NextResponse.json(
      { error: "Error interno al finalizar la solicitud" },
      { status: 500 }
    );
  }
}
