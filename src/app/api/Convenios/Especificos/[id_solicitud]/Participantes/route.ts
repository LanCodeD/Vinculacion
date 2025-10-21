import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { registrarRevisionPaso } from "@/lib/registrarRevisionPaso";

// =========================================================
// 🔹 GET — Obtener docentes y estudiantes participantes
// =========================================================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id_solicitud: string }> }
) {
  const { id_solicitud } = await context.params;

  try {
    const usuario = await getSessionUser();
    if (!usuario)
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const id = parseInt(id_solicitud, 10);
    if (Number.isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    // 🔹 Validar propiedad o permisos
    const solicitud = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
      select: { creado_por_usuario_id: true },
    });

    if (!solicitud)
      return NextResponse.json({ error: "No existe la solicitud" }, { status: 404 });

    if (solicitud.creado_por_usuario_id !== usuario.id && usuario.role !== "Administrador")
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    // 🔹 Obtener datos de docentes y estudiantes
    const docentes = await prisma.solicitud_docentes.findMany({
      where: { id_solicitud: id },
      orderBy: { id_docente: "asc" },
    });

    const estudiantes = await prisma.solicitud_estudiantes.findMany({
      where: { id_solicitud: id },
      orderBy: { id_estudiante: "asc" },
    });

    return NextResponse.json({ docentes, estudiantes }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /Participantes error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// =========================================================
// 🔹 PUT — Guardar o actualizar docentes y estudiantes
// =========================================================
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id_solicitud: string }> }
) {
  const { id_solicitud } = await context.params;

  try {
    const usuario = await getSessionUser();
    if (!usuario)
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const id = parseInt(id_solicitud, 10);
    if (Number.isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    // 🔹 Validar propiedad
    const solicitud = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
      select: { creado_por_usuario_id: true },
    });

    if (!solicitud)
      return NextResponse.json({ error: "No existe la solicitud" }, { status: 404 });

    if (solicitud.creado_por_usuario_id !== usuario.id)
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    // 🔹 Leer body
    const body = await req.json();
    const { docentes = [], estudiantes = [] } = body;

    // 🔸 Validaciones básicas
    if (!Array.isArray(docentes) || !Array.isArray(estudiantes))
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 });

    // ✅ Validar que los campos requeridos estén completos
    const docenteIncompleto = docentes.some(
      (d: any) => !d.nombre_completo?.trim() || !d.programa_educativo?.trim() || !d.rol_en_proyecto?.trim()
    );
    if (docenteIncompleto)
      return NextResponse.json(
        { error: "Todos los docentes deben tener nombre, programa educativo y rol en el proyecto" },
        { status: 400 }
      );

    const estudianteIncompleto = estudiantes.some(
      (e: any) => !e.nombre_completo?.trim() || !e.programa_educativo?.trim() || !e.semestre?.trim()
    );
    if (estudianteIncompleto)
      return NextResponse.json(
        { error: "Todos los estudiantes deben tener nombre, programa educativo y semestre" },
        { status: 400 }
      );

    // 🔹 Limpiar datos antiguos para esta solicitud
    await prisma.$transaction([
      prisma.solicitud_docentes.deleteMany({ where: { id_solicitud: id } }),
      prisma.solicitud_estudiantes.deleteMany({ where: { id_solicitud: id } }),
    ]);

    // 🔹 Insertar nuevos docentes y estudiantes
    await prisma.$transaction([
      prisma.solicitud_docentes.createMany({
        data: docentes.map((d: any, i: number) => ({
          id_solicitud: id,
          numero: i + 1,
          nombre_completo: d.nombre_completo,
          grado_academico: d.grado_academico ?? null,
          programa_educativo: d.programa_educativo ?? null,
          rol_en_proyecto: d.rol_en_proyecto ?? null,
        })),
      }),
      prisma.solicitud_estudiantes.createMany({
        data: estudiantes.map((e: any, i: number) => ({
          id_solicitud: id,
          numero: i + 1,
          nombre_completo: e.nombre_completo,
          genero: e.genero ?? null,
          programa_educativo: e.programa_educativo ?? null,
          semestre: e.semestre ?? null,
          grupo: e.grupo ?? null,
        })),
      }),
    ]);

    // 🔹 Registrar paso como revisado
    await registrarRevisionPaso(id, "Participantes", usuario.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ PUT /Participantes error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
