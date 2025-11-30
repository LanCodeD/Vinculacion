// api/Admin/BolsaTrabajo/Ofertas/[id]/Postulaciones/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptionsCredencial";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["Administrador", "Subadministrador"].includes(session.user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await context.params;
    const ofertaId = Number(id);

    if (isNaN(ofertaId)) {
      return NextResponse.json({ error: "ID de oferta inválido" }, { status: 400 });
    }

    // ==========================
    // 1. Obtener datos de la oferta
    // ==========================
    const oferta = await prisma.ofertas.findUnique({
      where: { id_ofertas: ofertaId },
      select: {
        id_ofertas: true,
        titulo: true,
        descripcion_general: true,
        fecha_publicacion: true,
        creado_en: true,
        empresas: {
          select: {
            nombre_comercial: true,
            propietario: {
              select: {
                foto_perfil: true
              }
            }
          }
        }
      }
    });
    if (!oferta) {
      return NextResponse.json({ error: "Oferta no encontrada" }, { status: 404 });
    }

    // ==========================
    // 2. Obtener postulantes + info completa
    // ==========================
    const postulacionesRaw = await prisma.postulaciones.findMany({
      where: { ofertas_id: ofertaId },
      select: {
        id_postulaciones: true,
        mensaje: true,
        estado: {
          select: {
            nombre_estado: true,
            id_postulacion_estados: true
          }
        },
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            correo: true,
            celular: true,
            foto_perfil: true,
            egresados_perfil: {
              select: { cv_url: true },
              take: 1
            }
          }
        }
      }
    });

    // Formateado para el frontend
    const postulaciones = postulacionesRaw.map(p => ({
      id_postulacion: p.id_postulaciones,
      nombre: p.usuario.nombre,
      apellido: p.usuario.apellido,
      correo: p.usuario.correo,
      celular: p.usuario.celular,
      foto: p.usuario.foto_perfil,
      cv_url: p.usuario.egresados_perfil[0]?.cv_url ?? null,
      estado: p.estado.nombre_estado,
      estadoId: p.estado.id_postulacion_estados,
      mensaje: p.mensaje ?? null 
    }));

    return NextResponse.json({
      ok: true,
      oferta: {
        id: oferta.id_ofertas,
        titulo: oferta.titulo,
        empresa: oferta.empresas.nombre_comercial,
        empresa_foto: oferta.empresas.propietario?.foto_perfil ?? null,
        descripcion_general: oferta.descripcion_general,
        fecha_publicacion: oferta.fecha_publicacion,
        creado_en: oferta.creado_en
      },
      postulaciones
    });

  } catch (error) {
    console.error("❌ Error en GET /api/...:", error);
    return NextResponse.json({ error: "Error al obtener postulaciones" }, { status: 500 });
  }
}
