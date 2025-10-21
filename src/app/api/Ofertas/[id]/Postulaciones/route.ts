// src/app/api/Ofertas/[id]/Postulaciones/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const idOferta = parseInt(params.id);

    // 🟦 Agrega este log para confirmar que llega la petición
    console.log("📩 GET postulaciones para oferta ID:", idOferta);

    const oferta = await prisma.ofertas.findUnique({
      where: { id_ofertas: idOferta },
      include: { empresas: true },
    });

    if (!oferta) {
        console.warn("⚠️ Oferta no encontrada con ID:", idOferta);
      return NextResponse.json({ ok: false, error: "Oferta no encontrada" }, { status: 404 });
    }

    const postulaciones = await prisma.postulaciones.findMany({
      where: { ofertas_id: idOferta },
      include: {
        usuario: { include: { egresados_perfil: true } }, // esto solo funciona si 'usuarios' tiene la relación 'egresado'
        estado: true,
      },
      orderBy: { creado_en: "desc" },
    });

    const mapped = postulaciones.map(p => ({
      id_postulaciones: p.id_postulaciones,
      mensaje: p.mensaje,
      estado: {
        id_postulacion_estados: p.postulacion_estados_id,
        nombre_estado: p.estado?.nombre_estado || "Desconocido",
      },
      usuario: {
        id_usuarios: p.usuarios_id,
        nombre: p.usuario.nombre,
        correo: p.usuario.egresados_perfil[0]?.correo_institucional || p.usuario.correo,
      },
    }));

        // 🟢 Y este justo antes del return, para ver si realmente hay resultados
    console.log("📤 Enviando postulaciones:", mapped);

    return NextResponse.json({ ok: true, postulaciones: mapped });
  } catch (error) {
    console.error("Error GET postulaciones:", error);
    return NextResponse.json({ ok: false, error: "Error al obtener postulaciones" }, { status: 500 });
  }
}
