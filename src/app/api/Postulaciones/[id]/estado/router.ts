import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { nuevoEstadoId, revisadoPorUsuarioId } = await req.json();

    const post = await prisma.postulaciones.update({
      where: { id_postulaciones: id },
      data: {
        postulacion_estados_id: parseInt(nuevoEstadoId),
        revisado_por_usuarios_id: parseInt(revisadoPorUsuarioId),
        revisado_en: new Date(),
      },
      include: { usuario: true, oferta: true },
    });

    await prisma.notificaciones.create({
      data: {
        usuarios_id: post.usuario.id_usuarios,
        tipo: 'postulacion_actualizada',
        titulo: 'Actualización en tu postulación',
        mensaje: `Tu postulación a "${post.oferta.titulo}" fue ${parseInt(nuevoEstadoId) === 3 ? 'aceptada' : 'rechazada'}.`,
      },
    });

    return NextResponse.json({ ok: true, post });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Error al actualizar postulación' }, { status: 500 });
  }
}

