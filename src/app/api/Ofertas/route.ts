import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const rol = url.searchParams.get('rol'); // 'admin', 'empresa', 'egresado'
  const empresaIdParam = url.searchParams.get('empresaId');

  let where: any = {};

  if (rol === 'egresado') {
    where = { oferta_estados_id: 2 }; // Solo publicadas
  } else if (rol === 'empresa' && empresaIdParam) {
    where = { empresas_id: parseInt(empresaIdParam) };
  }

  const ofertas = await prisma.ofertas.findMany({
    where,
    include: { empresas: true, estado: true },
    orderBy: { creado_en: 'desc' },
  });

  return NextResponse.json({ ok: true, ofertas });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const titulo = body.titulo;
    const descripcion = body.descripcion;
    const empresaId = parseInt(body.empresaId);
    const usuarioId = parseInt(body.usuarioId);

    const oferta = await prisma.ofertas.create({
      data: {
        titulo,
        descripcion,
        empresas_id: empresaId,
        creado_por_usuarios_id: usuarioId,
        oferta_estados_id: 1, // Pendiente
      },
    });

    // Notificar admins/subadmins
    const admins = await prisma.usuarios.findMany({
      where: { roles_id: { in: [4, 5] } }, // 4=Admin, 5=Subadmin
    });

    if (admins.length > 0) {
      await prisma.notificaciones.createMany({
        data: admins.map(a => ({
          usuarios_id: a.id_usuarios,
          tipo: 'nueva_vacante',
          titulo: 'Nueva vacante pendiente de aprobación',
          mensaje: `Una empresa ha creado la vacante "${titulo}".`,
        })),
      });
    }

    return NextResponse.json({ ok: true, oferta });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Error al crear vacante' }, { status: 500 });
  }
}
