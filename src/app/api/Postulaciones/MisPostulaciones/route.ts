import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const usuario = await getSessionUser();
    if (!usuario) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });

    const postulaciones = await prisma.postulaciones.findMany({
      where: { usuarios_id: usuario.id },
      include: {
        estado: true,
        oferta: {
          include: {
            empresas: true, // si tienes descripción de la oferta
          },
        },
      },
      orderBy: { creado_en: "desc" },
    });

    const mapped = postulaciones.map(p => ({
      id_postulaciones: p.id_postulaciones,
      mensaje: p.mensaje,
      creado_en: p.creado_en,
      estado: {
        id_postulacion_estados: p.postulacion_estados_id,
        nombre_estado: p.estado?.nombre_estado || "Desconocido",
      },
      oferta: {
        id_ofertas: p.ofertas_id,
        titulo: p.oferta.titulo,
        vacante: p.oferta.puesto,
        empresa: p.oferta.empresas.nombre_comercial,
        descripcion_general: p.oferta.descripcion_general || "No hay descripción",
      },
    }));

    return NextResponse.json({ ok: true, postulaciones: mapped });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Error al obtener postulaciones" }, { status: 500 });
  }
}
