// app/api/Postulaciones/[id]/estadoVacante/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { plantillaEstadoPostulante } from "@/lib/PlantillasCorreos/estadoPostulante";
import { enviarCorreo } from "@/lib/mailer";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    const { accion, revisadoPorUsuarioId, mensaje } = await req.json();

    if (!accion || !revisadoPorUsuarioId) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // ⚠️ Obtener el estado actual antes de actualizar
    const postulacionActual = await prisma.postulaciones.findUnique({
      where: { id_postulaciones: idNum },
      select: { postulacion_estados_id: true },
    });

    if (!postulacionActual) {
      return NextResponse.json(
        { ok: false, error: "Postulación no encontrada" },
        { status: 404 }
      );
    }

    // 🚫 Bloquear cambios si ya está Aprobada (3) o Rechazada (4)
    if (postulacionActual.postulacion_estados_id === 3 || postulacionActual.postulacion_estados_id === 4) {
      return NextResponse.json(
        { ok: false, error: "No se puede cambiar el estado de una postulación ya aprobada o rechazada" },
        { status: 400 }
      );
    }

    const nuevoEstadoId = accion === "aprobar" ? 3 : accion === "rechazar" ? 4 : 2;

    const postulacion = await prisma.postulaciones.update({
      where: { id_postulaciones: idNum },
      data: {
        postulacion_estados_id: nuevoEstadoId,
        revisado_por_usuarios_id: revisadoPorUsuarioId,
        revisado_en: new Date(),
        ...(accion === "rechazar" && mensaje ? { mensaje } : {}),
      },
      include: {
        usuario: true,
        oferta: { include: { empresas: true } },
        estado: true,
      },
    });

    // 📩 Enviar correo
    const correoHtml = plantillaEstadoPostulante({
      nombreEgresado: postulacion.usuario.nombre,
      tituloVacante: postulacion.oferta.titulo,
      empresa: postulacion.oferta.empresas.nombre_comercial,
      estado: nuevoEstadoId === 3 ? "aprobada" : nuevoEstadoId === 4 ? "rechazada" : "revision",
      botonUrl: `https://tu-sistema.com/postulaciones/${postulacion.id_postulaciones}`,
    });

    await enviarCorreo({
      to: postulacion.usuario.correo,
      subject:
        nuevoEstadoId === 3
          ? "Tu postulación fue aprobada"
          : nuevoEstadoId === 4
            ? "Tu postulación fue rechazada"
            : "Tu postulación está en revisión",
      html: correoHtml,
    });

    // 👇 Notificación en BD
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
        mensaje: `Tu postulación a "${postulacion.oferta.titulo}" fue ${nuevoEstadoId === 3 ? "aprobada" : nuevoEstadoId === 4 ? "rechazada" : "marcada como en revisión"}.`,
      },
    });

    return NextResponse.json({
      ok: true,
      postulacion,
      message: "Estado actualizado y correo enviado",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error al actualizar" },
      { status: 500 }
    );
  }
}
