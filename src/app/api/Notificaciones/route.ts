import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const usuarioIdParam = url.searchParams.get('usuarioId');

  if (!usuarioIdParam) {
    return NextResponse.json({ ok: false, error: 'Falta usuarioId' }, { status: 400 });
  }

  const usuarioId = parseInt(usuarioIdParam);

  const notificaciones = await prisma.notificaciones.findMany({
    where: { usuarios_id: usuarioId },
    orderBy: { creado_en: 'desc' },
  });

  return NextResponse.json({ ok: true, notificaciones });
}
