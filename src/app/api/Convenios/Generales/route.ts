// app/api/Convenios/Generales/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1) Validar sesión
    const usuario = await getSessionUser();
    if (!usuario) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const tipo_solicitud_id = body?.tipo_solicitud_id ?? 1; // default 1 = GENERAL

    // 2) Validación: evitar más de una solicitud pendiente/en revisión
    const existente = await prisma.solicitud_convenios.findFirst({
      where: {
        creado_por_usuario_id: usuario.id,
        estado_id: 1, // ✅ Solo bloquea si está pendiente
      },
    });

    if (existente) {
      return NextResponse.json(
        { error: "Ya tienes una solicitud activa o en revisión" },
        { status: 409 }
      );
    }

    // Generar fecha local sin hora
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // quita las horas locales

    // Ajuste a UTC para que Prisma no desplace el día
    const fechaLocal = new Date(
      hoy.getTime() - hoy.getTimezoneOffset() * 60000
    );

    // 3) Crear la solicitud padre
    const nueva = await prisma.solicitud_convenios.create({
      data: {
        creado_por_usuario_id: usuario.id, // usa usuario.id (según tu tipado de session)
        tipo_solicitud_id,
        estado_id: 1, // pendiente
        fecha_solicitud: fechaLocal, // opcional: fecha de creación
      },
    });

    // 4) Retornar sólo lo que necesita el frontend (id)
    return NextResponse.json(
      { id_solicitud: nueva.id_solicitud },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/Convenios/Generales error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
