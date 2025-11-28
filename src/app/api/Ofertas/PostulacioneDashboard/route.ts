// src/app/api/Ofertas/PostulacioneDashboard/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ofertas = await prisma.ofertas.findMany({
      select: {
        id_ofertas: true,
        titulo: true,
        postulaciones: {
          select: {
            postulacion_estados_id: true,
          },
        },
      },
    });

    const data = ofertas.map((o) => {
      const total = o.postulaciones.length;

      const aceptados = o.postulaciones.filter(
        (p) => p.postulacion_estados_id === 3
      ).length;

      const rechazados = o.postulaciones.filter(
        (p) => p.postulacion_estados_id === 4
      ).length;

      return {
        id: o.id_ofertas,
        titulo: o.titulo,
        postulantes: total,
        aceptados,
        rechazados,
      };
    });

    // Ordenar por más postulantes
    data.sort((a, b) => b.postulantes - a.postulantes);

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("❌ Error dashboard postulantes:", error);
    return NextResponse.json(
      { ok: false, error: "Error al cargar datos" },
      { status: 500 }
    );
  }
}
