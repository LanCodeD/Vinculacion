import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const usuario = await getSessionUser();

    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const grupos = await prisma.grupos.findMany({
      orderBy: { creado_en: "desc" },
      select: {
        id_grupos: true,
        nombre_grupo: true,
        _count: {
          select: { contactos: true }, // 👈 cuenta contactos relacionados
        },
      },
    });

    return NextResponse.json(grupos);
  } catch (error) {
    console.error("Error al recuperar grupos:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const usuario = await getSessionUser();

    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();

    if (!body.nombre_grupo || body.nombre_grupo.trim() === "") {
      return NextResponse.json(
        { error: "El nombre del grupo es obligatorio" },
        { status: 400 }
      );
    }

    await prisma.grupos.create({
      data: {
        nombre_grupo: body.nombre_grupo.trim(),
        creado_en: new Date(),
        actualizado_en: new Date(),
      },
    });

    // 👇 después de crear, recuperamos la lista completa
    const grupos = await prisma.grupos.findMany({
      orderBy: { creado_en: "desc" },
      select: {
        id_grupos: true,
        nombre_grupo: true,
        _count: {
          select: { contactos: true },
        },
      },
    });

    return NextResponse.json(grupos, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error al crear grupo:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un grupo con ese nombre" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
