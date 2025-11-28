// api/Admin/BolsaTrabajo/Ofertas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["Administrador", "Subadministrador"].includes(session.user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const ofertas = await prisma.ofertas.findMany({
      include: {
        empresas: { select: { nombre_comercial: true } },
        estado: { select: { nombre_estado: true } },
        postulaciones: {
          include: {
            estado: { select: { id_postulacion_estados: true, nombre_estado: true } },
          },
        },
      },
      orderBy: { fecha_publicacion: "desc" },
    });

    const data = ofertas.map(oferta => {
      const total = oferta.postulaciones.length;
      const aceptados = oferta.postulaciones.filter(p => p.estado.id_postulacion_estados === 3).length;
      const rechazados = oferta.postulaciones.filter(p => p.estado.id_postulacion_estados === 4).length;
      const pendientes = total - aceptados - rechazados;

      return {
        id_ofertas: oferta.id_ofertas,
        titulo: oferta.titulo,
        empresa: oferta.empresas.nombre_comercial,
        estado: oferta.estado.nombre_estado,
        fecha_publicacion: oferta.fecha_publicacion,
        total,
        aceptados,
        rechazados,
        pendientes,
      };
    });

    return NextResponse.json({ ok: true, data });

  } catch (error) {
    console.error("❌ Error en GET /api/Admin/BolsaTrabajo/Ofertas:", error);
    return NextResponse.json({ error: "Error al obtener ofertas" }, { status: 500 });
  }
}
