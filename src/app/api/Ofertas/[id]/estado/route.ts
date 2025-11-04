// src/app/api/Ofertas/[id]/estado/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
    }

    const idNum = parseInt(id);
    const { accion } = await req.json();

    const estadoMap: Record<string, number> = {
      aprobar: 3,
      rechazar: 4,
    };

    if (!estadoMap[accion]) {
      return NextResponse.json({ ok: false, error: "Acción inválida" }, { status: 400 });
    }

    const oferta = await prisma.ofertas.update({
      where: { id_ofertas: idNum },
      data: {
        oferta_estados_id: estadoMap[accion],
        verificado_por_usuarios_id: session.user.id,
        verificado_en: new Date(),
      },
      include: { empresas: true },
    });

    // Notificar empresa
    await prisma.notificaciones.create({
      data: {
        usuarios_id: oferta.empresas.usuarios_id,
        tipo: "oferta_actualizada",
        titulo: "Tu vacante fue revisada",
        mensaje: `Tu oferta "${oferta.titulo}" fue ${
          accion === "aprobar" ? "aprobada y publicada" : "rechazada"
        }.`,
      },
    });

    // Notificar egresados si fue publicada
    if (accion === "aprobar") {
      const egresados = await prisma.usuarios.findMany({ where: { roles_id: 2 } });
      if (egresados.length > 0) {
        await prisma.notificaciones.createMany({
          data: egresados.map((e) => ({
            usuarios_id: e.id_usuarios,
            tipo: "nueva_oferta_publicada",
            titulo: "Nueva vacante disponible",
            mensaje: `Nueva vacante publicada: "${oferta.titulo}".`,
          })),
        });
      }
    }

    return NextResponse.json({ ok: true, oferta });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error al actualizar estado de la vacante" },
      { status: 500 }
    );
  }
}
