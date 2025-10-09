import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ofertaId = parseInt(body.ofertaId);
    const usuarioId = parseInt(body.usuarioId);
    const mensaje = body.mensaje || '';

    const egresado = await prisma.egresados.findFirst({ where: { usuarios_id: usuarioId } });
    if (!egresado) return NextResponse.json({ ok: false, error: 'Usuario no es egresado' }, { status: 400 });

    const postulacion = await prisma.postulaciones.create({
      data: {
        ofertas_id: ofertaId,
        usuarios_id: usuarioId,
        mensaje,
        postulacion_estados_id: 1, // Enviada
      },
      include: { oferta: { include: { empresas: true } } },
    });

    await prisma.notificaciones.create({
      data: {
        usuarios_id: postulacion.oferta.empresas.usuarios_id,
        tipo: 'nueva_postulacion',
        titulo: 'Nueva postulación recibida',
        mensaje: `Un egresado se ha postulado a "${postulacion.oferta.titulo}".`,
      },
    });

    return NextResponse.json({ ok: true, postulacion });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Error al postular' }, { status: 500 });
  }
}


