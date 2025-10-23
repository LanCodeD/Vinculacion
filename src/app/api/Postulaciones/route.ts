// src/app/api/Postulaciones/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { enviarCorreo } from '@/lib/mailer'; // tu función de envío de correo

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

    // Evitar postulaciones duplicadas
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
        postulacion: existente,
      }, { status: 400 });
    }

    // Crear postulación
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

    const empresa = postulacion.oferta.empresas;

    // Crear notificación en la DB
    await prisma.notificaciones.create({
      data: {
        usuarios_id: empresa.usuarios_id,
        tipo: "nueva_postulacion",
        titulo: "Nueva postulación recibida",
        mensaje: `Un egresado se ha postulado a "${postulacion.oferta.titulo}".`,
      },
    });

    // Enviar correo a la empresa (rol 3)
    const usuarioEmpresa = await prisma.usuarios.findFirst({
      where: { id_usuarios: empresa.usuarios_id, roles_id: 3 },
    });

    if (usuarioEmpresa?.correo) {
      await enviarCorreo({
        to: usuarioEmpresa.correo,
        subject: `Nueva postulación a "${postulacion.oferta.titulo}"`,
        html: `<p>Hola ${usuarioEmpresa.nombre},</p>
               <p>Un egresado se ha postulado a tu vacante "<strong>${postulacion.oferta.titulo}</strong>".</p>
               <p>Revisa la postulación en el panel de administración de tu empresa.</p>
               <p>Saludos,<br/>Equipo de Vinculación</p>`,
      });
      console.log("Correo enviado a empresa:", usuarioEmpresa.correo);
    }

    return NextResponse.json({ ok: true, postulacion });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error al postular" },
      { status: 500 }
    );
  }
}
