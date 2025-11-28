// src/app/api/ReporteSolicitudes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

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
    const solicitudes = await prisma.solicitud_convenios.findMany({
      where: {
        fecha_solicitud: {
          gte: inicio,
          lte: fin,
        },
        convenio_concretado: null, // 👈 solo solicitudes NO concluidas
      },
      select: {
        id_solicitud: true,
        fecha_solicitud: true,
        creado_por_usuario_id: true,
        tipo_solicitud_id: true,
        estado_id: true,
        reviewed_by_user_id: true,
        reviewed_at: true,
        creador: { select: { id_usuarios: true, nombre: true, apellido: true, correo: true } },
        revisor: { select: { id_usuarios: true, nombre: true, apellido: true, correo: true } },
        tipo: { select: { id_tipo: true, nombre_tipo: true } },
        estado: { select: { id_estado: true, nombre_estado: true } },
      },
      orderBy: { fecha_solicitud: "asc" },
    });

    // 📊 Métricas
    const total = solicitudes.length;

    // Agrupación por estado
    const porEstado: Record<string, number> = {};
    for (const s of solicitudes) {
      const estadoNombre = s.estado?.nombre_estado ?? "SIN ESTADO";
      porEstado[estadoNombre] = (porEstado[estadoNombre] || 0) + 1;
    }

    // Agrupación por tipo de solicitud
    const porTipo: Record<string, number> = {};
    for (const s of solicitudes) {
      const tipoNombre = s.tipo?.nombre_tipo ?? "SIN TIPO";
      porTipo[tipoNombre] = (porTipo[tipoNombre] || 0) + 1;
    }

    // Agrupación por creador
    const porCreador: Record<string, number> = {};
    for (const s of solicitudes) {
      const creadorNombre = s.creador ? `${s.creador.nombre} ${s.creador.apellido}` : "SIN CREADOR";
      porCreador[creadorNombre] = (porCreador[creadorNombre] || 0) + 1;
    }

    return NextResponse.json({
      total,
      porEstado,
      porTipo,
      porCreador,
      solicitudes,
      rango: { inicio: inicio.toISOString(), fin: fin.toISOString() },
    });
  } catch (error) {
    console.error("❌ Error en reporte de solicitudes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
