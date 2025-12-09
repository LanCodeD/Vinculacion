import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { anio, trimestre, fechaInicio, fechaFin } = body;

    // Año por defecto en UTC
    const year = anio || new Date().getUTCFullYear();

    let inicio = dayjs.utc(`${year}-01-01`).startOf("day").toDate();
    let fin = dayjs.utc(`${year}-12-31`).endOf("day").toDate();

    // Trimestres
    if (trimestre) {
      switch (trimestre) {
        case "Q1":
          inicio = dayjs.utc(`${year}-01-01`).startOf("day").toDate();
          fin = dayjs.utc(`${year}-03-31`).endOf("day").toDate();
          break;
        case "Q2":
          inicio = dayjs.utc(`${year}-04-01`).startOf("day").toDate();
          fin = dayjs.utc(`${year}-06-30`).endOf("day").toDate();
          break;
        case "Q3":
          inicio = dayjs.utc(`${year}-07-01`).startOf("day").toDate();
          fin = dayjs.utc(`${year}-09-30`).endOf("day").toDate();
          break;
        case "Q4":
          inicio = dayjs.utc(`${year}-10-01`).startOf("day").toDate();
          fin = dayjs.utc(`${year}-12-31`).endOf("day").toDate();
          break;
      }
    }

    // Rango manual
    if (fechaInicio && fechaFin) {
      const i = dayjs.utc(fechaInicio).startOf("day");
      const f = dayjs.utc(fechaFin).endOf("day");

      if (i.isValid() && f.isValid()) {
        inicio = i.toDate();
        fin = f.toDate();
      }
    }

    const ofertas = await prisma.ofertas.findMany({
      where: {
        oferta_estados_id: { in: [3, 4, 5] },
        fecha_publicacion: {
          gte: inicio,
          lte: fin,
        },
      },
      include: {
        empresas: true,
        postulaciones: true,
      },
      orderBy: {
        fecha_publicacion: "asc",
      },
    });

    return Response.json({
      total: ofertas.length,
      porEstado: {
        publicadas: ofertas.filter(o => o.oferta_estados_id === 3).length,
        rechazadas: ofertas.filter(o => o.oferta_estados_id === 4).length,
        cerradas: ofertas.filter(o => o.oferta_estados_id === 5).length,
      },
      ofertas,
      rango: {
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
      },
    });

  } catch (error) {
    console.error("❌ ERROR EN SERVIDOR:", error);
    return Response.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
