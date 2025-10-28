// src/app/api/Ofertas/Empresa/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const empresa = await prisma.empresas.findFirst({
    where: { usuarios_id: session.user.id },
  });

  if (!empresa)
    return NextResponse.json({ ok: false, error: "Empresa no encontrada" }, { status: 404 });

  const vacantes = await prisma.ofertas.findMany({
    where: { empresas_id: empresa.id_empresas },
    select: {
      id_ofertas: true,
      titulo: true,
      puesto: true,
      descripcion_general: true,
      imagen: true,
      oferta_estados_id: true,
    },
    orderBy: { creado_en: "desc" },
  });

  return NextResponse.json({ ok: true, vacantes });
}