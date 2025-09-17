import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const academias = await prisma.academias_ingenierias.findMany({
      select: {
        id_academias: true,
        ingenieria: true,
      },
      orderBy: { id_academias: "asc" },
    });

    return NextResponse.json(academias);
  } catch (error) {
    console.error("Error obteniendo academias:", error);
    return NextResponse.json(
      { error: "Error al obtener academias" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      usuarios_id,
      matricula,
      titulo,
      puesto,
      fechaEgreso,
      correoInstitucional,
      academias_ingenierias_id,
    } = body;

    // Validaciones
    if (!usuarios_id) {
      return NextResponse.json({ error: "Se requiere usuariosId" }, { status: 400 });
    }
    if (!matricula || !academias_ingenierias_id) {
      return NextResponse.json({ error: "Campos obligatorios faltantes" }, { status: 400 });
    }

    let fecha: Date | null = null;
    if (fechaEgreso) {
      fecha = new Date(fechaEgreso);
      if (isNaN(fecha.getTime())) {
        return NextResponse.json({ error: "Fecha de egreso inválida" }, { status: 400 });
      }
    }

    // Crear perfil de egresado
    const perfil = await prisma.egresados.create({
      data: {
        usuarios_id: usuarios_id,
        matricula,
        titulo,
        puesto,
        fecha_egreso: fecha,
        correo_institucional: correoInstitucional,
        academias_ingenierias_id: academias_ingenierias_id,
        empresas_id: 1, // Empresa del plantel
      },
    });

    return NextResponse.json({ success: true, perfil }, { status: 201 });
  } catch (error) {
    console.error("Error creando perfil de egresado:", error);
    return NextResponse.json({ error: "Error al crear perfil de egresado" }, { status: 500 });
  }
}
