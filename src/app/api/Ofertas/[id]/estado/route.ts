import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { nuevoEstadoId, revisadoPorUsuarioId } = await req.json();

    const oferta = await prisma.ofertas.update({
      where: { id_ofertas: id },
      data: {
        oferta_estados_id: parseInt(nuevoEstadoId),
        verificado_por_usuarios_id: parseInt(revisadoPorUsuarioId),
        verificado_en: new Date(),
      },
      include: { empresas: true },
    });

    // Notificar a empresa
    await prisma.notificaciones.create({
      data: {
        usuarios_id: oferta.empresas.usuarios_id,
        tipo: 'oferta_aprobada',
        titulo: 'Tu vacante fue actualizada',
        mensaje: `Tu oferta "${oferta.titulo}" fue ${parseInt(nuevoEstadoId) === 2 ? 'aprobada y publicada' : 'rechazada'}.`,
      },
    });

    // Notificar a egresados si fue publicada
    if (parseInt(nuevoEstadoId) === 2) {
      const egresados = await prisma.usuarios.findMany({ where: { roles_id: 2 } });
      if (egresados.length > 0) {
        await prisma.notificaciones.createMany({
          data: egresados.map(e => ({
            usuarios_id: e.id_usuarios,
            tipo: 'nueva_oferta_publicada',
            titulo: 'Nueva vacante disponible',
            mensaje: `Nueva vacante publicada: "${oferta.titulo}".`,
          })),
        });
      }
    }

    return NextResponse.json({ ok: true, oferta });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Error al actualizar estado de la vacante' }, { status: 500 });
  }
}

