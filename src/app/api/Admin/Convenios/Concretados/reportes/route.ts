import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type EstadoConvenio = "ACTIVO" | "PRÓXIMO A VENCER" | "VENCIDO" | "SIN FECHA";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const anio = Number(searchParams.get("anio")) || new Date().getUTCFullYear();
    const trimestre = searchParams.get("trimestre");
    const fechaInicio = searchParams.get("fechaInicio");
    const fechaFin = searchParams.get("fechaFin");

    // 📌 Inicializa con rango anual en UTC
    let inicio = dayjs.utc(`${anio}-01-01`).startOf("day").toDate();
    let fin = dayjs.utc(`${anio}-12-31`).endOf("day").toDate();

    // 📌 Trimestres en UTC
    if (trimestre) {
      switch (trimestre) {
        case "Q1":
          inicio = dayjs.utc(`${anio}-01-01`).startOf("day").toDate();
          fin = dayjs.utc(`${anio}-03-31`).endOf("day").toDate();
          break;
        case "Q2":
          inicio = dayjs.utc(`${anio}-04-01`).startOf("day").toDate();
          fin = dayjs.utc(`${anio}-06-30`).endOf("day").toDate();
          break;
        case "Q3":
          inicio = dayjs.utc(`${anio}-07-01`).startOf("day").toDate();
          fin = dayjs.utc(`${anio}-09-30`).endOf("day").toDate();
          break;
        case "Q4":
          inicio = dayjs.utc(`${anio}-10-01`).startOf("day").toDate();
          fin = dayjs.utc(`${anio}-12-31`).endOf("day").toDate();
          break;
      }
    }

    // 📌 Rango manual en UTC
    if (fechaInicio && fechaFin) {
      const i = dayjs.utc(fechaInicio).startOf("day");
      const f = dayjs.utc(fechaFin).endOf("day");
      if (i.isValid() && f.isValid()) {
        inicio = i.toDate();
        fin = f.toDate();
      }
    }

    // 📌 Query en Prisma
    const convenios = await prisma.convenio_concretado.findMany({
      where: {
        fecha_firmada: {
          gte: inicio,
          lte: fin,
        },
      },
      select: {
        id_convenio_concretado: true,
        fecha_firmada: true,
        fecha_expira: true,
        estado_dinamico: true,
        eficiencia: true,
        meta: { select: { id_metas_convenios: true, nombre: true } },
      },
      orderBy: { fecha_firmada: "asc" },
    });

    // 📊 Métricas
    const total = convenios.length;
    const porEstado: Record<EstadoConvenio | "DESCONOCIDO", number> = {
      ACTIVO: 0,
      "PRÓXIMO A VENCER": 0,
      VENCIDO: 0,
      "SIN FECHA": 0,
      DESCONOCIDO: 0,
    };
    const porMeta: Record<string, number> = {};

    for (const c of convenios) {
      const estado: EstadoConvenio | "DESCONOCIDO" =
        c.estado_dinamico === "ACTIVO" ||
        c.estado_dinamico === "PRÓXIMO A VENCER" ||
        c.estado_dinamico === "VENCIDO" ||
        c.estado_dinamico === "SIN FECHA"
          ? (c.estado_dinamico as EstadoConvenio)
          : "DESCONOCIDO";

      porEstado[estado] = (porEstado[estado] || 0) + 1;

      const metaNombre = c.meta?.nombre ?? "Sin meta";
      porMeta[metaNombre] = (porMeta[metaNombre] || 0) + 1;
    }

    return NextResponse.json({
      total,
      porEstado,
      porMeta,
      convenios,
      rango: { inicio: inicio.toISOString(), fin: fin.toISOString() },
    });
  } catch (error) {
    console.error("❌ Error en reporte de convenios:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
