import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { registrarRevisionPaso } from "@/lib/registrarRevisionPaso";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id_solicitud: string }> }
) {
  const { id_solicitud } = await context.params;
  try {
    const usuario = await getSessionUser();
    if (!usuario) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const id = parseInt(id_solicitud);
    if (Number.isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    // Verificar que la solicitud pertenezca al usuario
    const solicitud = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
      select: { creado_por_usuario_id: true },
    });
    if (!solicitud) return NextResponse.json({ error: "No existe la solicitud" }, { status: 404 });
    if (solicitud.creado_por_usuario_id !== usuario.id && usuario.role !== "Administrador")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    // Obtener responsabilidades existentes con nombres legibles
    const responsabilidades = await prisma.solicitud_responsabilidades.findMany({
      where: { id_solicitud: id },
      include: {
        actor: true,
        categoria: true,
      },
    });

    return NextResponse.json(responsabilidades, { status: 200 });
  } catch (error) {
    console.error("GET responsabilidades error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id_solicitud: string }> }
) {
  const { id_solicitud } = await context.params;

  try {
    const usuario = await getSessionUser();
    if (!usuario)
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const id = parseInt(id_solicitud);
    if (Number.isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const body = await req.json();

    // 🔹 Limpiar responsabilidades previas
    await prisma.solicitud_responsabilidades.deleteMany({
      where: { id_solicitud: id },
    });

    // 🔹 Crear nuevas responsabilidades
    const dataInsert = [
      // Plantel
      { id_solicitud: id, actor_id: 1, responsabilidad_categorias_id: 1, contenido: body.plantel.financieros },
      { id_solicitud: id, actor_id: 1, responsabilidad_categorias_id: 2, contenido: body.plantel.academicos },
      { id_solicitud: id, actor_id: 1, responsabilidad_categorias_id: 3, contenido: body.plantel.entregables },
      // Empresa
      { id_solicitud: id, actor_id: 2, responsabilidad_categorias_id: 1, contenido: body.empresa.financieros },
      { id_solicitud: id, actor_id: 2, responsabilidad_categorias_id: 2, contenido: body.empresa.academicos },
      { id_solicitud: id, actor_id: 2, responsabilidad_categorias_id: 3, contenido: body.empresa.entregables },
    ];

    await prisma.solicitud_responsabilidades.createMany({ data: dataInsert });

    // 🔹 Registrar el paso como "EN REVISIÓN" si el global está en "EN CORRECCIÓN" (5)
    await registrarRevisionPaso(id, "Responsabilidades", usuario.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ PUT responsabilidades error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
