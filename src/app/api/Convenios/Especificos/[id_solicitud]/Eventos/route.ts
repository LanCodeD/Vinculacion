import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { registrarRevisionPaso } from "@/lib/registrarRevisionPaso";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id_solicitud: string }> }
) {
  try {
    const usuario = await getSessionUser();
    if (!usuario)
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id_solicitud } = await context.params;
    const id = parseInt(id_solicitud);
    if (Number.isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    // Validar que la solicitud pertenezca al usuario
    const solicitud = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
      select: { creado_por_usuario_id: true },
    });
    if (!solicitud)
      return NextResponse.json(
        { error: "No existe la solicitud" },
        { status: 404 }
      );
    if (solicitud.creado_por_usuario_id !== usuario.id && usuario.role !== "Administrador")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    // Obtener los datos del evento
    const detalle = await prisma.solicitud_convenio_detalle.findUnique({
      where: { id_solicitud: id },
      select: {
        ceremonia_realizara: true,
        ceremonia_fecha_hora: true,
        ceremonia_lugar: true,
        requerimientos_evento: true,
      },
    });

    return NextResponse.json(detalle || {}, { status: 200 });
  } catch (error) {
    console.error("GET evento error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id_solicitud: string }> }
) {
  try {
    const usuario = await getSessionUser();
    if (!usuario)
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id_solicitud } = await context.params;
    const id = parseInt(id_solicitud);
    const body = await req.json();

    const fechaHoraLocal = body.ceremonia_fecha_hora
      ? new Date(body.ceremonia_fecha_hora + ":00")
      : null;

    // 🔹 Actualizar datos del paso
    await prisma.solicitud_convenio_detalle.update({
      where: { id_solicitud: id },
      data: {
        ceremonia_realizara: !!body.ceremonia_realizara,
        ceremonia_fecha_hora: fechaHoraLocal
          ? new Date(
              fechaHoraLocal.getTime() -
                fechaHoraLocal.getTimezoneOffset() * 60000
            )
          : null,
        ceremonia_lugar: body.ceremonia_lugar || null,
        requerimientos_evento: body.requerimientos_evento || null,
      },
    });

    // 🔹 Registrar el paso como "EN REVISIÓN" si aplica
    await registrarRevisionPaso(id, "Eventos", usuario.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("PUT evento error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}