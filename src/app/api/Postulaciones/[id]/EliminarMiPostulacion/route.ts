import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const usuario = await getSessionUser();
    if (!usuario)
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });

    const { id } = await context.params;
    const idNumber = parseInt(id);
    if (isNaN(idNumber))
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });

    const postulacion = await prisma.postulaciones.findUnique({
      where: { id_postulaciones: idNumber },
      include: { estado: true },
    });

    if (!postulacion || postulacion.usuarios_id !== usuario.id) {
      return NextResponse.json({ ok: false, error: "Postulación no encontrada" }, { status: 404 });
    }

    // Validar que no esté aceptada
    if (postulacion.postulacion_estados_id === 3) {
      return NextResponse.json({ ok: false, error: "No se puede eliminar una postulación aceptada" }, { status: 400 });
    }

    await prisma.postulaciones.delete({ where: { id_postulaciones: idNumber } });

    return NextResponse.json({ ok: true, message: "Postulación eliminada correctamente" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Error al eliminar postulación" }, { status: 500 });
  }
}
