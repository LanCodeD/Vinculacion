// src/app/api/Postulaciones/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ofertaId = parseInt(body.ofertaId);
    const usuarioId = parseInt(body.usuarioId);
    const mensaje = body.mensaje || "";

    const egresado = await prisma.egresados.findFirst({
      where: { usuarios_id: usuarioId },
      include: { usuarios: true },
    });
    if (!egresado)
      return NextResponse.json(
        { ok: false, error: "Solo los egresados pueden postularse." },
        { status: 400 }
      );

    console.log("Usuario que postula:", egresado.usuarios.nombre, egresado.usuarios.correo);
    // ✅ Evitar postulaciones duplicadas
    const existente = await prisma.postulaciones.findUnique({
      where: {
        ofertas_id_usuarios_id: {
          ofertas_id: ofertaId,
          usuarios_id: usuarioId,
        },
      },
    });

    if (existente) {
      return NextResponse.json({
        ok: false,
        error: "Ya te has postulado a esta vacante.",
        postulacion: existente, // 🔹 agregamos los datos
      }, { status: 400 });
    }

    const postulacion = await prisma.postulaciones.create({
      data: {
        ofertas_id: ofertaId,
        usuarios_id: usuarioId,
        mensaje,
        postulacion_estados_id: 1, // Enviada
      },
      include: {
        oferta: { include: { empresas: true } },
      },
    });

    // Crear notificación para la empresa
    await prisma.notificaciones.create({
      data: {
        usuarios_id: postulacion.oferta.empresas.usuarios_id,
        tipo: "nueva_postulacion",
        titulo: "Nueva postulación recibida",
        mensaje: `Un egresado se ha postulado a "${postulacion.oferta.titulo}".`,
      },
    });

    return NextResponse.json({ ok: true, postulacion });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error al postular" },
      { status: 500 }
    );
  }
}



