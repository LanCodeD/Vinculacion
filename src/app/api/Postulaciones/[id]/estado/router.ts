import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { accion, revisadoPorUsuarioId } = await req.json();

    const nuevoEstadoId = accion === "aprobar" ? 3 : 4; // 3=publicada, 4=rechazada

    const oferta = await prisma.ofertas.update({
      where: { id_ofertas: id },
      data: {
        oferta_estados_id: nuevoEstadoId,
        verificado_por_usuarios_id: revisadoPorUsuarioId,
        verificado_en: new Date(),
      },
      include: { empresas: true },
    });

    // Notificaciones
    await prisma.notificaciones.create({
      data: {
        usuarios_id: oferta.empresas.usuarios_id,
        tipo: "oferta_actualizada",
        titulo: "Tu vacante fue revisada",
        mensaje: `Tu oferta "${oferta.titulo}" fue ${nuevoEstadoId === 3 ? "aprobada y publicada" : "rechazada"}.`,
      },
    });

    return NextResponse.json({ ok: true, oferta });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error al actualizar estado de la vacante" },
      { status: 500 }
    );
  }
}
