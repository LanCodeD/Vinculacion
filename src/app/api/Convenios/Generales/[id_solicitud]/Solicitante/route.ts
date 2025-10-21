import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { registrarRevisionPaso } from "@/lib/registrarRevisionPaso";

// =========================================================
// 🔹 GET — Obtener datos del solicitante
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

    // 🔹 Validar que la solicitud exista y pertenezca al usuario
    const solicitud = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
      select: { creado_por_usuario_id: true },
    });

    if (!solicitud)
      return NextResponse.json({ error: "No existe la solicitud" }, { status: 404 });

    if (solicitud.creado_por_usuario_id !== usuario.id && usuario.role !== "Administrador")
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    // 🔹 Traer detalle del solicitante
    const detalle = await prisma.solicitud_convenio_detalle.findUnique({
      where: { id_solicitud: id },
      select: {
        solicitante_nombre: true,
        solicitante_email: true,
        solicitante_telefono_movil: true,
        solicitante_telefono_oficina: true,
        solicitante_ext_oficina: true,
      },
    });

    return NextResponse.json(detalle ?? {}, { status: 200 });
  } catch (error) {
    console.error("❌ GET /Solicitante error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// =========================================================
// 🔹 PUT — Guardar o actualizar datos del solicitante
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

    // 🔹 Obtener datos del body
    const body = await req.json();
    const {
      solicitante_nombre = null,
      solicitante_email = null,
      solicitante_telefono_movil = null,
      solicitante_telefono_oficina = null,
      solicitante_ext_oficina = null,
    } = body;

    if (!solicitante_nombre)
      return NextResponse.json(
        { error: "El nombre del solicitante es obligatorio" },
        { status: 400 }
      );

    // 🔹 Guardar o actualizar los datos
    const detalle = await prisma.solicitud_convenio_detalle.upsert({
      where: { id_solicitud: id },
      create: {
        id_solicitud: id,
        solicitante_nombre,
        solicitante_email,
        solicitante_telefono_movil,
        solicitante_telefono_oficina,
        solicitante_ext_oficina,
      },
      update: {
        solicitante_nombre,
        solicitante_email,
        solicitante_telefono_movil,
        solicitante_telefono_oficina,
        solicitante_ext_oficina,
      },
    });

    // 🔹 Registrar el paso en revisión si aplica
    await registrarRevisionPaso(id, "Solicitante", usuario.id);

    return NextResponse.json({ success: true, detalle }, { status: 200 });
  } catch (error) {
    console.error("❌ PUT /Solicitante error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
