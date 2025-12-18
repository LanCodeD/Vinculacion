// src/app/api/Ofertas/PostulacioneDashboard/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get("year");
    const year = yearParam ? Number(yearParam) : new Date().getFullYear();

    const ofertas = await prisma.ofertas.findMany({
      where: {
        oferta_estados_id: {
          in: [3, 5],
        },
      },
      select: {
        id_ofertas: true,
        titulo: true,
        postulaciones: {
          where: {
            creado_en: {
              gte: new Date(year, 0, 1),
              lte: new Date(year, 11, 31),
            },
          },
          select: {
            postulacion_estados_id: true,
            creado_en: true,
          },
        },
      },
    });

    const data = ofertas.map((o) => {
      const mesesSet = new Set<string>();

      let postulantes = 0;
      let aceptados = 0;
      let rechazados = 0;

      o.postulaciones.forEach((p) => {
        postulantes++;

        const mes = new Date(p.creado_en).toLocaleString("es-MX", {
          month: "long",
        });

        mesesSet.add(mes);

        if (p.postulacion_estados_id === 3) aceptados++;
        if (p.postulacion_estados_id === 4) rechazados++;
      });

      return {
        id: o.id_ofertas,
        titulo: o.titulo,
        postulantes,
        aceptados,
        rechazados,
        meses: Array.from(mesesSet), // 👈 AQUÍ ESTÁ LA CLAVE
      };
    });

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
