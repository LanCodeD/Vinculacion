import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const academias = await prisma.academias_ingenierias.findMany({
      select: { id_academias: true, ingenieria: true },
      orderBy: { ingenieria: "asc" },
    });

    return NextResponse.json(academias);
  } catch (error) {
    console.error("Error obteniendo academias/empresas:", error);
    return NextResponse.json(
      { error: "Error al obtener academias o empresas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { usuarios_id, titulo, puesto, academias_ingenierias_id } = body;

    if (!usuarios_id) {
      return NextResponse.json(
        { error: "Se requiere usuarios_id" },
        { status: 400 }
      );
    }

    // Crear perfil de docente
    const perfil = await prisma.docentes.create({
      data: {
        usuarios_id,
        titulo,
        puesto,
        academias_ingenierias_id,
        empresas_id: 1, // Empresa del plantel
      },
    });

    return NextResponse.json({ success: true, perfil }, { status: 201 });
  } catch (error) {
    console.error("Error creando perfil de docente:", error);
    return NextResponse.json(
      { error: "Error al crear perfil de docente" },
      { status: 500 }
    );
  }
}
