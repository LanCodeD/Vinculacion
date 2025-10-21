import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { registrarRevisionPaso } from "@/lib/registrarRevisionPaso";

// =========================================================
// 📘 GET — Obtener datos de la sección "Datos de Empresa"
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

    // 🔹 Verificar propiedad
    const padre = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
      select: { creado_por_usuario_id: true },
    });
    if (!padre)
      return NextResponse.json({ error: "Solicitud no existe" }, { status: 404 });

    if (padre.creado_por_usuario_id !== usuario.id && usuario.role !== "Administrador")
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    // 🔹 Obtener datos actuales
    const detalle = await prisma.solicitud_convenio_detalle.findUnique({
      where: { id_solicitud: id },
      select: {
        dependencia_nombre: true,
        descripcion_empresa: true,
        dependencia_responsable_nombre: true,
        dependencia_rfc: true,
        dependencia_domicilio_legal: true,
      },
    });

    return NextResponse.json(detalle ?? {}, { status: 200 });
  } catch (error) {
    console.error("❌ GET /DatosEmpresa error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// =========================================================
// 💾 PUT — Guardar datos de la sección "Datos de Empresa"
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
    const padre = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
      select: { creado_por_usuario_id: true },
    });
    if (!padre)
      return NextResponse.json({ error: "Solicitud no existe" }, { status: 404 });
    if (padre.creado_por_usuario_id !== usuario.id)
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    // 🔹 Leer y validar datos del body
    const body = await req.json();
    const {
      dependencia_nombre = null,
      descripcion_empresa = null,
      dependencia_responsable_nombre = null,
      dependencia_rfc = null,
      dependencia_domicilio_legal = null,
    } = body;

    if (!dependencia_nombre)
      return NextResponse.json(
        { error: "El nombre de la empresa es obligatorio" },
        { status: 400 }
      );

    // 🔹 Guardar o actualizar
    const detalle = await prisma.solicitud_convenio_detalle.upsert({
      where: { id_solicitud: id },
      create: {
        id_solicitud: id,
        dependencia_nombre,
        descripcion_empresa,
        dependencia_responsable_nombre,
        dependencia_rfc,
        dependencia_domicilio_legal,
      },
      update: {
        dependencia_nombre,
        descripcion_empresa,
        dependencia_responsable_nombre,
        dependencia_rfc,
        dependencia_domicilio_legal,
      },
    });

    // 🔹 Registrar el paso "DatosEmpresa" en historial si aplica
    await registrarRevisionPaso(id, "DatosEmpresa", usuario.id);

    return NextResponse.json({ success: true, detalle }, { status: 200 });
  } catch (error) {
    console.error("❌ PUT /DatosEmpresa error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
