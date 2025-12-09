import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { anio, trimestre, fechaInicio, fechaFin } = body;

    const year = anio || new Date().getUTCFullYear();

    // Año por defecto
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

    const postulaciones = await prisma.postulaciones.findMany({
      where: {
        creado_en: {
          gte: inicio,
          lte: fin,
        },
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
        oferta: {
          select: {
            titulo: true,
            empresas: {
              select: {
                nombre_comercial: true,
              },
            },
          },
        },
        estado: {
          select: {
            nombre_estado: true,
          },
        },
      },
      orderBy: {
        creado_en: "asc",
      },
    }
    );
    // Contadores optimizados
    let pendientes = 0;
    let aceptados = 0;
    let rechazados = 0;

    for (const p of postulaciones) {
      if (p.postulacion_estados_id === 1) pendientes++;
      else if (p.postulacion_estados_id === 3) aceptados++;
      else if (p.postulacion_estados_id === 4) rechazados++;
    }
    return Response.json({
      total: postulaciones.length,
      porEstado: {
        pendientes,
        aceptados,
        rechazados,
      },
      postulaciones: postulaciones.map(p => ({
        id_postulaciones: p.id_postulaciones,
        revisado_en: p.revisado_en,
        postulacion_estados_id: p.postulacion_estados_id,

        usuario: {
          nombre: p.usuario.nombre,
          apellido: p.usuario.apellido,
        },

        oferta: {
          titulo: p.oferta?.titulo ?? "Sin título",
          empresas: {
            nombre_comercial: p.oferta?.empresas?.nombre_comercial ?? "Sin empresa",
          },
        },

        estado: {
          nombre_estado:
            p.postulacion_estados_id === 1
              ? "Pendiente"
              : p.estado.nombre_estado,
        },
        mensaje: p.mensaje,
      })),
      rango: {
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
      },
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
