import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export async function GET() {
  try {
    const hoy = dayjs();
    const meses = [0, 1, 2].map(i => hoy.subtract(i, "month")).reverse();

    const fechasLabels = meses.map(m => ({
      label: `${m.format("MMM")} ${m.year()}`,
      inicio: m.startOf("month").toDate(),
      fin: m.endOf("month").toDate(),
    }));

    const resultados = await Promise.all(
      fechasLabels.map(({ inicio, fin }) =>
        prisma.convenio_concretado.count({
          where: {
            fecha_firmada: {
              gte: inicio,
              lte: fin,
            },
          },
        })
      )
    );

    const data = fechasLabels.map((f, i) => ({
      mes: f.label,
      total: resultados[i],
    }));

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("Error en convenios concretados:", error);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
