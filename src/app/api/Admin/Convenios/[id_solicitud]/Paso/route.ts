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
    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const id = parseInt(id_solicitud, 10);
    const { paso, estado_id, comentario } = await req.json();

    if (!paso || !estado_id) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // 🔹 Registrar el cambio de estado del paso
    await prisma.solicitud_estado_historial.create({
      data: {
        id_solicitud: id,
        paso,
        estado_id,
        comentario: comentario ?? null,
        cambiado_por_usuario_id: usuario.id,
      },
    });

    // 🔹 Recalcular estado global correctamente
    const pasos = [
    "TipoConvenio",
    "DatosEmpresa",
    "Solicitante",
    "Eventos",
    ];
    

    // Traer todos los registros de historial
    const registros = await prisma.solicitud_estado_historial.findMany({
      where: { id_solicitud: id },
      orderBy: { created_at: "asc" },
    });

    // Obtener último estado por paso
    const estadosPorPaso = pasos.map((p) => {
      const registrosPaso = registros.filter((r) => r.paso === p);
      const ultimo = registrosPaso[registrosPaso.length - 1];
      return ultimo?.estado_id ?? 1; // 1 = PENDIENTE por defecto
    });

    const todosAprobados = estadosPorPaso.every((e) => e === 3);
    const algunRechazado = estadosPorPaso.some((e) => e === 4);

    const nuevoEstadoGlobal = todosAprobados ? 3 : algunRechazado ? 5 : 2;

    await prisma.solicitud_convenios.update({
      where: { id_solicitud: id },
      data: { estado_id: nuevoEstadoGlobal },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al actualizar paso admin:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
