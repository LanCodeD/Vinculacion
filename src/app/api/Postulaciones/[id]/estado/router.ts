// src/app/api/Postulaciones/[id]/estado/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { accion, revisadoPorUsuarioId } = await req.json();

    if (!accion || !revisadoPorUsuarioId) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos requeridos (acción o usuario revisor)" },
        { status: 400 }
      );
    }

    // Estados de postulaciones:
    // 1 = Enviada
    // 2 = En revisión
    // 3 = Aprobada
    // 4 = Rechazada
    const nuevoEstadoId =
      accion === "aprobar" ? 3 : accion === "rechazar" ? 4 : 2;

    // ✅ Actualizamos la postulación
    const postulacion = await prisma.postulaciones.update({
      where: { id_postulaciones: id },
      data: {
        postulacion_estados_id: nuevoEstadoId,
        revisado_por_usuarios_id: revisadoPorUsuarioId,
        revisado_en: new Date(),
      },
      include: {
        usuario: true, // el egresado
        oferta: { include: { empresas: true } },
      },
    });

    // ✅ Creamos notificación para el egresado
    await prisma.notificaciones.create({
      data: {
        usuarios_id: postulacion.usuarios_id,
        tipo: "postulacion_actualizada",
        titulo:
          nuevoEstadoId === 3
            ? "Tu postulación fue aprobada"
            : nuevoEstadoId === 4
            ? "Tu postulación fue rechazada"
            : "Tu postulación está en revisión",
        mensaje: `Tu postulación a la vacante "${postulacion.oferta.titulo}" fue ${
          nuevoEstadoId === 3
            ? "aprobada ✅"
            : nuevoEstadoId === 4
            ? "rechazada ❌"
            : "marcada como en revisión 🔍"
        }.`,
      },
    });

    return NextResponse.json({
      ok: true,
      postulacion,
      message: "Estado de postulación actualizado correctamente",
    });
  } catch (error) {
    console.error("❌ Error al actualizar postulación:", error);
    return NextResponse.json(
      { ok: false, error: "Error al actualizar el estado de la postulación" },
      { status: 500 }
    );
  }
}
