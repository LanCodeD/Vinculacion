import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registrarRevisionPaso } from "@/lib/registrarRevisionPaso";

// ===================================================
// 📄 GET - Obtener datos del paso "TipoConvenio Específico"
// ===================================================
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

    // 🔹 Traemos los datos del detalle de la solicitud
    const detalle = await prisma.solicitud_convenio_detalle.findUnique({
      where: { id_solicitud: id },
      select: {
        nombre_proyecto: true,
        alcance: true,
        fecha_inicio_proyecto: true,
        fecha_conclusion_proyecto: true,
      },
    });

    // 🔹 Firmas asociadas
    const firmas = await prisma.solicitud_firmas_origen.findMany({
      where: { id_solicitud: id },
      select: { id_firma: true },
    });

    return NextResponse.json(
      {
        ...detalle,
        firmas_origen: firmas.map((f) => f.id_firma),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ GET TipoConvenioEspecifico error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// ===================================================
// 📝 PUT - Guardar cambios del paso "TipoConvenio Específico"
// ===================================================
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
    const body = await req.json();

    const {
      nombre_proyecto,
      alcance_proyecto, // viene con este nombre desde el frontend
      fecha_inicio_proyecto,
      fecha_conclusion_proyecto,
      firmas_origen = [],
    } = body;

    // ======================================================
    // 🔹 Actualizar o crear detalle del convenio
    // ======================================================
    await prisma.solicitud_convenio_detalle.upsert({
      where: { id_solicitud: id },
      create: {
        id_solicitud: id,
        nombre_proyecto,
        alcance: alcance_proyecto,
        fecha_inicio_proyecto: fecha_inicio_proyecto
          ? new Date(`${fecha_inicio_proyecto}T00:00:00.000Z`)
          : null,
        fecha_conclusion_proyecto: fecha_conclusion_proyecto
          ? new Date(`${fecha_conclusion_proyecto}T00:00:00.000Z`)
          : null,
      },
      update: {
        nombre_proyecto,
        alcance: alcance_proyecto,
        fecha_inicio_proyecto: fecha_inicio_proyecto
          ? new Date(`${fecha_inicio_proyecto}T00:00:00.000Z`)
          : null,
        fecha_conclusion_proyecto: fecha_conclusion_proyecto
          ? new Date(`${fecha_conclusion_proyecto}T00:00:00.000Z`)
          : null,
      },
    });

    // ======================================================
    // 🔹 Actualizar las firmas seleccionadas
    // ======================================================
    await prisma.solicitud_firmas_origen.deleteMany({
      where: { id_solicitud: id },
    });

    if (firmas_origen.length > 0) {
      await prisma.solicitud_firmas_origen.createMany({
        data: firmas_origen.map((fid: number) => ({
          id_solicitud: id,
          id_firma: fid,
        })),
      });
    }

    // ======================================================
    // 🔹 Registrar la revisión del paso
    // ======================================================
    await registrarRevisionPaso(id, "TipoConvenio", usuario.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ PUT TipoConvenioEspecifico error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
