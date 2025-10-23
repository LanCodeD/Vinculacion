// src/app/api/Ofertas/[id]/Postulaciones/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const idOferta = parseInt(id);

    console.log("📩 GET postulaciones para oferta ID:", idOferta);

    const oferta = await prisma.ofertas.findUnique({
      where: { id_ofertas: idOferta },
      include: { empresas: true },
    });

    if (!oferta) {
      return NextResponse.json({ ok: false, error: "Oferta no encontrada" }, { status: 404 });
    }

    const postulaciones = await prisma.postulaciones.findMany({
      where: { ofertas_id: idOferta },
      include: {
        usuario: {
          include: {
            egresados_perfil: true,
          },
        },
        estado: true,
      },
      orderBy: { creado_en: "desc" },
    });

    const mapped = postulaciones.map((p) => {
      const egresado = p.usuario.egresados_perfil?.[0];
      return {
        id_postulaciones: p.id_postulaciones,
        mensaje: p.mensaje,
        estado: {
          id_postulacion_estados: p.postulacion_estados_id,
          nombre_estado: p.estado?.nombre_estado || "Desconocido",
        },
        usuario: {
          id_usuarios: p.usuarios_id,
          nombre: p.usuario.nombre,
          correo: egresado?.correo_institucional || p.usuario.correo,
          celular: p.usuario.celular,
          titulo: egresado?.titulo || "No especificado",
          matricula: egresado?.matricula || "No registrada",
          fecha_egreso: egresado?.fecha_egreso || null,
          cv_url: egresado?.cv_url || null,
        },
      };
    });

    console.log("📤 Enviando postulaciones:", mapped.length);

    return NextResponse.json({ ok: true, postulaciones: mapped });
  } catch (error) {
    console.error("❌ Error GET postulaciones:", error);
    return NextResponse.json(
      { ok: false, error: "Error al obtener postulaciones" },
      { status: 500 }
    );
  }
}
