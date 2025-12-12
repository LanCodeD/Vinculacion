// src/app/api/Ofertas/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptionsCredencial";
import { prisma } from "@/lib/prisma";
import { plantillaVacanteEditadaAdmin } from "@/lib/PlantillasCorreos/vacanteEditadaAdmin";
import { plantillaVacanteEditadaEgresado } from "@/lib/PlantillasCorreos/vacanteEditadaEgresado";
import { enviarCorreo } from "@/lib/mailer";
import { getFechaLocalSinHora } from "@/lib/fechaLocal";

// Obtener detalle de la vacante
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 }
      );

    const { id } = await context.params;
    const idNumber = parseInt(id);

    if (isNaN(idNumber))
      return NextResponse.json(
        { ok: false, error: "ID inválido" },
        { status: 400 }
      );

    const empresa = await prisma.empresas.findFirst({
      where: { usuarios_id: session.user.id },
    });

    if (!empresa)
      return NextResponse.json(
        { ok: false, error: "Empresa no encontrada" },
        { status: 404 }
      );

    const vacante = await prisma.ofertas.findUnique({
      where: { id_ofertas: idNumber },
      select: {
        id_ofertas: true,
        titulo: true,
        descripcion_general: true,
        requisitos: true,
        horario: true,
        modalidad: true,
        puesto: true,
        ubicacion: true,
        imagen: true,
        fecha_cierre: true,
        empresas_id: true,
        oferta_estados_id: true,
        ingenierias_ofertas: {
          select: {
            academia: {
              select: { id_academias: true, ingenieria: true },
            },
          },
        },
      },
    });

    if (!vacante || vacante.empresas_id !== empresa.id_empresas)
      return NextResponse.json(
        { ok: false, error: "Acceso denegado" },
        { status: 403 }
      );

    return NextResponse.json({ ok: true, vacante });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error al obtener vacante" },
      { status: 500 }
    );
  }
}

// Eliminar vacante
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });

    const { id } = await context.params;
    const idNumber = parseInt(id);
    if (isNaN(idNumber))
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });

    // ✅ Verificar empresa propietaria
    const empresa = await prisma.empresas.findFirst({
      where: { usuarios_id: session.user.id },
    });

    if (!empresa)
      return NextResponse.json({ ok: false, error: "Empresa no encontrada" }, { status: 404 });

    // ✅ Buscar la vacante y sus postulaciones
    const vacante = await prisma.ofertas.findUnique({
      where: { id_ofertas: idNumber },
      include: { postulaciones: true, estado: true },
    });

    if (!vacante || vacante.empresas_id !== empresa.id_empresas)
      return NextResponse.json({ ok: false, error: "Acceso denegado" }, { status: 403 });

    // ✅ Si tiene postulantes, marcar como CERRADA (id = 5)
    if (vacante.postulaciones.length > 0) {
      if (vacante.oferta_estados_id === 5) {
        return NextResponse.json({
          ok: false,
          error: "La vacante ya está cerrada.",
        });
      }

      await prisma.ofertas.update({
        where: { id_ofertas: idNumber },
        data: { oferta_estados_id: 5 },
      });

      return NextResponse.json({
        ok: true,
        cerrada: true,
        mensaje: "La vacante tiene postulantes y fue marcada como CERRADA 🔒",
      });
    }

    // ✅ Si no tiene postulantes, eliminarla físicamente
    await prisma.ofertas.delete({ where: { id_ofertas: idNumber } });

    return NextResponse.json({
      ok: true,
      cerrada: false,
      mensaje: "Vacante eliminada correctamente 🗑️",
    });
  } catch (error) {
    console.error("❌ Error al eliminar vacante:", error);
    return NextResponse.json(
      { ok: false, error: "Error al eliminar vacante" },
      { status: 500 }
    );
  }
}

// Editar o cambiar estado de vacante
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });

    const { id } = await context.params;
    const idNumber = parseInt(id);
    if (isNaN(idNumber))
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });

    const empresa = await prisma.empresas.findFirst({
      where: { usuarios_id: session.user.id },
    });
    if (!empresa)
      return NextResponse.json({ ok: false, error: "Empresa no encontrada" }, { status: 404 });

    const vacante = await prisma.ofertas.findUnique({
      where: { id_ofertas: idNumber },
    });
    if (!vacante || vacante.empresas_id !== empresa.id_empresas)
      return NextResponse.json({ ok: false, error: "Acceso denegado" }, { status: 403 });

    const body = await req.json();

    // 🔹 Caso 1: solo cambiar estado (reabrir o cerrar)
    if (typeof body.nuevoEstado === "number") {
      const updated = await prisma.ofertas.update({
        where: { id_ofertas: idNumber },
        data: { oferta_estados_id: body.nuevoEstado },
      });

      return NextResponse.json({
        ok: true,
        mensaje: "Estado de la vacante actualizado correctamente",
        updated,
      });
    }

    // 🔹 Caso 2: edición completa (manda a revisión)
    const {
      titulo,
      descripcion_general,
      requisitos,
      horario,
      modalidad,
      puesto,
      ubicacion,
      imagen,
      fecha_cierre,
      ingenierias,
    } = body;

    const updated = await prisma.ofertas.update({
      where: { id_ofertas: idNumber },
      data: {
        titulo,
        descripcion_general,
        requisitos,
        horario,
        modalidad,
        puesto,
        ubicacion,
        imagen,
        fecha_cierre: fecha_cierre
          ? getFechaLocalSinHora(fecha_cierre)
          : vacante.fecha_cierre,
        oferta_estados_id: 2, // Solo aquí se manda a revisión
      },
    });

    if (ingenierias && Array.isArray(ingenierias)) {
      const ingenieriasValidas = ingenierias
        .filter((id: unknown) => typeof id === "number" && !isNaN(id))
        .filter((id: number, index: number, self: number[]) => self.indexOf(id) === index);

      await prisma.ofertas_ingenierias.deleteMany({
        where: { ofertas_id: idNumber },
      });

      if (ingenieriasValidas.length > 0) {
        await prisma.ofertas_ingenierias.createMany({
          data: ingenieriasValidas.map((ingId: number) => ({
            ofertas_id: idNumber,
            academias_id: ingId,
          })),
        });
      }
    }

    // 📌 Notificar EGRESADOS (rol 2) que ya estaban postulados
    const postulados = await prisma.postulaciones.findMany({
      where: { ofertas_id: idNumber },
      include: { usuario: true },
    });

    for (const post of postulados) {
      const html = plantillaVacanteEditadaEgresado({
        nombreEgresado: post.usuario.nombre,
        tituloVacante: updated.titulo,
        empresa: empresa.nombre_comercial,
        botonUrl: `${baseUrl}/BolsaTrabajo/MisPostulacionesFront/${updated.id_ofertas}`,
      });

      await enviarCorreo({
        to: post.usuario.correo,
        subject: "Actualización importante en una vacante",
        html,
      });

      // Notificación interna
      await prisma.notificaciones.create({
        data: {
          usuarios_id: post.usuarios_id,
          tipo: "vacante_editada",
          titulo: "La vacante que postulaste fue actualizada",
          mensaje: `La vacante "${updated.titulo}" ha sido modificada por la empresa.`,
          metadata: { vacanteId: updated.id_ofertas },
        },
      });
    }

    // 📌 Notificar ADMINS (rol 4)
    const admins = await prisma.usuarios.findMany({
      where: { roles_id: 4 },
    });

    for (const admin of admins) {
      const html = plantillaVacanteEditadaAdmin({
        adminNombre: admin.nombre,
        empresaNombre: empresa.nombre_comercial,
        tituloVacante: updated.titulo,
        botonUrl: `${baseUrl}/Admin/BolsaTrabajoAD`,
      });

      await enviarCorreo({
        to: admin.correo,
        subject: "Vacante editada — Revisión requerida",
        html,
      });
    }

    return NextResponse.json({ ok: true, updated });
  } catch (error) {
    console.error("❌ Error al editar vacante:", error);
    return NextResponse.json(
      { ok: false, error: "Error al editar vacante" },
      { status: 500 }
    );
  }
}

