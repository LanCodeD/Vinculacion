import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const usuario = await getSessionUser();

    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // 👇 Espera la promesa de params
    const { id } = await params;
    const idNum = Number(id);

    if (!idNum) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const convenio = await tx.convenio_concretado.findUnique({
        where: { id_convenio_concretado: idNum },
        select: { id_solicitud: true },
      });

      if (!convenio) throw new Error("Convenio no encontrado");

      await tx.convenio_concretado.delete({
        where: { id_convenio_concretado: idNum },
      });

      await tx.solicitud_convenios.update({
        where: { id_solicitud: convenio.id_solicitud },
        data: { estado_id: 6 },
      });

      return { message: "Convenio eliminado y solicitud actualizada" };
    });

    return NextResponse.json(resultado, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar convenio:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
