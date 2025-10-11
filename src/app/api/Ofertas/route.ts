import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    // Buscar la empresa asociada al usuario
    const empresa = await prisma.empresas.findFirst({
      where: { usuarios_id: session.user.id },
    });

    if (!empresa) {
      return NextResponse.json(
        { ok: false, error: "Empresa no encontrada" },
        { status: 404 }
      );
    }

    // Obtener las vacantes creadas por esta empresa
    const vacantes = await prisma.ofertas.findMany({
      where: { empresas_id: empresa.id_empresas },
      select: {
        id_ofertas: true,
        titulo: true,
        puesto: true,
        descripcion: true,
        imagen: true,
        oferta_estados_id: true,
      },
      orderBy: { fecha_publicacion: "desc" },
    });

    return NextResponse.json({ ok: true, vacantes });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error al obtener vacantes" },
      { status: 500 }
    );
  }
}
