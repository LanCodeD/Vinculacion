import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id_solicitud: string }> }
) {
  const { id_solicitud } = await context.params;

  try {
    const usuario = await getSessionUser();
    if (!usuario)
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const id = parseInt(id_solicitud, 10);
    if (Number.isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    // Verificar propiedad
    const solicitud = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
      select: { creado_por_usuario_id: true, estado_id: true },
    });

    if (!solicitud)
      return NextResponse.json(
        { error: "No existe la solicitud" },
        { status: 404 }
      );
    if (solicitud.creado_por_usuario_id !== usuario.id)
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    // 1️⃣ Traer el historial por pasos
    const pasos = [
      "TipoConvenio",
      "DatosEmpresa",
      "Solicitante",
      "Eventos", // o "Evento", pero igual en todos lados
    ];

    const registros = await prisma.solicitud_estado_historial.findMany({
      where: { id_solicitud: id },
      orderBy: { created_at: "asc" },
    });

    const historial = pasos.map((p) => {
      const registrosPaso = registros.filter((r) => r.paso === p);
      const ultimo = registrosPaso[registrosPaso.length - 1];
      return ultimo?.estado_id ?? 1;
    });

    const algunRechazado = historial.some((estado) => estado === 4);

    if (algunRechazado) {
      return NextResponse.json(
        {
          error: "Aún existen secciones rechazadas que no han sido corregidas",
        },
        { status: 400 }
      );
    }

    // 2️⃣ Si todo está en revisión o aprobado → actualizar estado global a EN REVISION (2)
    await prisma.solicitud_convenios.update({
      where: { id_solicitud: id },
      data: { estado_id: 2 },
    });

    // 3️⃣ Registrar evento en historial global
    await prisma.solicitud_estado_historial.create({
      data: {
        id_solicitud: id,
        estado_id: 2,
        cambiado_por_usuario_id: usuario.id,
        comentario: "Solicitud reenviada para revisión tras correcciones",
      },
    });

    return NextResponse.json({
      success: true,
      mensaje: "Solicitud reenviada correctamente",
    });
  } catch (error) {
    console.error("Error al reenviar solicitud:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
