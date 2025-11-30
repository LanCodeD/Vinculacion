import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Conteo de solicitudes en corrección (estado_id = 5)
    const enCorreccion = await prisma.solicitud_convenios.count({
      where: { estado_id: 5 },
    });

    // Conteo de solicitudes finalizadas (estado_id = 6)
    const finalizadas = await prisma.solicitud_convenios.count({
      where: { estado_id: 6 },
    });

    // Conteo de convenios concretados (estado_id = 7)
    const concretados = await prisma.solicitud_convenios.count({
      where: { estado_id: 7 },
    });

    return NextResponse.json({
      ok: true,
      data: {
        enCorreccion,
        finalizadas,
        concretados,
      },
    });
  } catch (error) {
    console.error("Error en KPIs convenios:", error);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
