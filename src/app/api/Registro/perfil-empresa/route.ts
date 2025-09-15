import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { usuarios_id, nombre_comercial, razon_social, rfc, direccion, correo, telefono } = body;

    if (!usuarios_id) return NextResponse.json({ error: "Se requiere usuarios_id" }, { status: 400 });
    if (!nombre_comercial || !rfc) return NextResponse.json({ error: "Campos obligatorios faltantes" }, { status: 400 });

    // Validar RFC único
    const empresaExistente = await prisma.empresas.findUnique({
      where: { rfc },
    });
    if (empresaExistente) {
      return NextResponse.json({ error: "Ya existe una empresa con este RFC" }, { status: 400 });
    }

    const empresa = await prisma.empresas.create({
      data: {
        usuarios_id,
        nombre_comercial,
        razon_social,
        rfc,
        direccion,
        correo,
        telefono,
      },
    });

    return NextResponse.json({ success: true, empresa }, { status: 201 });
  } catch (error) {
    console.error("Error creando empresa:", error);
    return NextResponse.json({ error: "Error al crear empresa" }, { status: 500 });
  }
}
