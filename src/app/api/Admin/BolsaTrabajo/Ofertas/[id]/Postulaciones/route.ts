import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["Administrador", "Subadministrador"].includes(session.user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await context.params; // ← necesario por el tipado nuevo
    const ofertaId = Number(id);

    if (isNaN(ofertaId)) {
      return NextResponse.json({ error: "ID de oferta inválido" }, { status: 400 });
    }

    const oferta = await prisma.ofertas.findUnique({
      where: { id_ofertas: ofertaId },
      include: {
        empresas: { select: { nombre_comercial: true } },
        estado: { select: { nombre_estado: true } },
        postulaciones: {
          include: {
            estado: { select: { id_postulacion_estados: true, nombre_estado: true } },
            usuario: { select: { id_usuarios: true, nombre: true, correo: true } },
          },
        },
      },
    });

    if (!oferta) {
      return NextResponse.json({ error: "Oferta no encontrada" }, { status: 404 });
    }

    const postulaciones = oferta.postulaciones.map((p) => ({
      id_postulacion: p.id_postulaciones,
      nombre: p.usuario.nombre,
      correo: p.usuario.correo,
      estado: p.estado.nombre_estado,
      estadoId: p.estado.id_postulacion_estados,
    }));

    return NextResponse.json({
      ok: true,
      oferta: {
        id: oferta.id_ofertas,
        titulo: oferta.titulo,
        empresa: oferta.empresas.nombre_comercial,
      },
      postulaciones,
    });

  } catch (error) {
    console.error("❌ Error en GET /api/...:", error);
    return NextResponse.json({ error: "Error al obtener postulaciones" }, { status: 500 });
  }
}
