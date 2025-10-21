// src/app/api/Ofertas/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { a } from "framer-motion/client";

// Obtener detalle de la vacante
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const idNumber = parseInt(id);

    if (isNaN(idNumber))
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });

    const empresa = await prisma.empresas.findFirst({
      where: { usuarios_id: session.user.id },
    });

    if (!empresa)
      return NextResponse.json({ ok: false, error: "Empresa no encontrada" }, { status: 404 });

    const vacante = await prisma.ofertas.findUnique({
      where: { id_ofertas: idNumber },
      select: {
        id_ofertas: true,
        titulo: true,
        descripcion: true,
        puesto: true,
        ubicacion: true,
        imagen: true,
        fecha_cierre: true,
        empresas_id: true,
        ingenierias_ofertas: {
          select: {
            academia: {
              select: { id_academias: true, ingenieria: true },
            },
          },
        },
      },
    });

    if (!vacante || vacante.empresas_id !== empresa.id_empresas)
      return NextResponse.json({ ok: false, error: "Acceso denegado" }, { status: 403 });

    return NextResponse.json({ ok: true, vacante });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Error al obtener vacante" }, { status: 500 });
  }
}

// Eliminar vacante
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const idNumber = parseInt(id);

    if (isNaN(idNumber))
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });

    const empresa = await prisma.empresas.findFirst({
      where: { usuarios_id: session.user.id },
    });
    if (!empresa)
      return NextResponse.json({ ok: false, error: "Empresa no encontrada" }, { status: 404 });

    const vacante = await prisma.ofertas.findUnique({ where: { id_ofertas: idNumber } });
    if (!vacante || vacante.empresas_id !== empresa.id_empresas)
      return NextResponse.json({ ok: false, error: "Acceso denegado" }, { status: 403 });

    await prisma.ofertas.delete({ where: { id_ofertas: idNumber } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Error al eliminar vacante" }, { status: 500 });
  }
}

// Editar vacante
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const idNumber = parseInt(id);

    if (isNaN(idNumber))
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });

    const body = await req.json();
    const empresa = await prisma.empresas.findFirst({
      where: { usuarios_id: session.user.id },
    });
    if (!empresa)
      return NextResponse.json({ ok: false, error: "Empresa no encontrada" }, { status: 404 });

    const vacante = await prisma.ofertas.findUnique({ where: { id_ofertas: idNumber } });
    if (!vacante || vacante.empresas_id !== empresa.id_empresas)
      return NextResponse.json({ ok: false, error: "Acceso denegado" }, { status: 403 });

    const { titulo, descripcion, puesto, ubicacion, imagen, fecha_cierre, ingenierias } = body;

    const updated = await prisma.ofertas.update({
      where: { id_ofertas: idNumber },
      data: {
        titulo,
        descripcion,
        puesto,
        ubicacion,
        imagen,
        fecha_cierre: fecha_cierre ? new Date(fecha_cierre) : vacante.fecha_cierre,
        oferta_estados_id: 2,
      },
    });

    // Actualizar ingenierías de forma segura
    if (ingenierias && Array.isArray(ingenierias)) {
      // Filtramos valores válidos (números distintos y no nulos)
      const ingenieriasValidas = ingenierias
        .filter((id: any) => typeof id === "number" && !isNaN(id))
        .filter((id: number, index: number, self: number[]) => self.indexOf(id) === index);

      // Eliminamos las ingenierías actuales
      await prisma.ofertas_ingenierias.deleteMany({
        where: { ofertas_id: idNumber },
      });

      // Insertamos las nuevas si hay alguna válida
      if (ingenieriasValidas.length > 0) {
        await prisma.ofertas_ingenierias.createMany({
          data: ingenieriasValidas.map((ingId: number) => ({
            ofertas_id: idNumber,
            academias_id: ingId,
          })),
        });
      }
    }

    return NextResponse.json({ ok: true, updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Error al editar vacante" }, { status: 500 });
  }
}
