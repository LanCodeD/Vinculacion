// src/app/api/Postulaciones/exists/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const usuarioId = parseInt(searchParams.get('usuarioId') || "0");
  const ofertaId = parseInt(searchParams.get('ofertaId') || "0");

  const existente = await prisma.postulaciones.findUnique({
    where: {
      ofertas_id_usuarios_id: {
        ofertas_id: ofertaId,
        usuarios_id: usuarioId,
      },
    },
  });

  return NextResponse.json({ postulado: !!existente });
}
