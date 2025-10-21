import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const pasos = [
  "TipoConvenio",
  "DatosEmpresa",
  "Solicitante",
  "Responsabilidades",
  "Participantes",
  "Eventos", // o "Evento", pero igual en todos lados
];

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

    // 1️⃣ Verificar existencia y permisos
    const solicitud = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
      select: { estado_id: true, creado_por_usuario_id: true },
    });

    if (!solicitud)
      return NextResponse.json(
        { error: "No existe la solicitud" },
        { status: 404 }
      );

    if (solicitud.creado_por_usuario_id !== usuario.id)
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    // 2️⃣ Traer todo el historial
    const registros = await prisma.solicitud_estado_historial.findMany({
      where: { id_solicitud: id },
      orderBy: { created_at: "asc" },
    });

    // 3️⃣ Obtener el estado más reciente de cada paso

    const historial = pasos.map((p) => {
      const registrosPaso = registros.filter((r) => r.paso === p);
      const registroReciente =
        registrosPaso.length > 0
          ? registrosPaso[registrosPaso.length - 1]
          : null;
      console.log("registro paso", registrosPaso);
      console.log("registro recientes", registroReciente);
      return {
        paso: p,
        estado: registroReciente
          ? estadoTexto(registroReciente.estado_id)
          : "PENDIENTE",
        comentario: registroReciente?.comentario ?? "",
      };
    });
    console.log("Esto es el historial: ", historial);

    // 4️⃣ Calcular si está bloqueado
    const algunRechazado = historial.some((h) => h.estado === "CORREGIR");
    // 🔹 Bloquear si:
    // - la solicitud está en REVISIÓN (2) o APROBADA (3)
    // - y no hay pasos rechazados
    const bloqueado =
      (solicitud.estado_id === 2 || solicitud.estado_id === 3) &&
      !algunRechazado;

    return NextResponse.json({ historial, bloqueado }, { status: 200 });
  } catch (error) {
    console.error("GET Auditoria error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

function estadoTexto(id: number) {
  switch (id) {
    case 1:
      return "PENDIENTE";
    case 2:
      return "EN REVISION";
    case 3:
      return "APROBADO";
    case 4:
      return "CORREGIR";
    default:
      return "DESCONOCIDO";
  }
}
