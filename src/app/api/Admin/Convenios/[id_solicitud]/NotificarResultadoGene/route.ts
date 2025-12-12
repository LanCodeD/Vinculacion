// /app/api/Admin/ConveniosGenerales/[id_solicitud]/NotificarResultado/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { enviarCorreo } from "@/lib/mailer";
import { plantillaResultadoRevisionGeneral } from "@/lib/PlantillasCorreos/resultadoRevisionGeneral";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id_solicitud: string }> }
) {
  const { id_solicitud } = await context.params;

  try {
    const usuario = await getSessionUser();
    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const id = parseInt(id_solicitud, 10);
    const solicitud = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
      include: { creador: true },
    });

    if (!solicitud || !solicitud.creador?.correo) {
      return NextResponse.json(
        { error: "Solicitante no encontrado" },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    // 🔹 Decidir mensaje según estado global
    const fueRechazada = solicitud.estado_id === 5; // EN CORRECCIÓN
    const fueAprobada = solicitud.estado_id === 3; // APROBADO

    const tipo = fueRechazada
      ? "solicitud_correccion_general"
      : fueAprobada
      ? "solicitud_aprobada_general"
      : "solicitud_revision_general";

    const titulo = fueRechazada
      ? "Tu solicitud de Convenio General requiere correcciones"
      : fueAprobada
      ? "Tu solicitud de Convenio General ha sido aprobada"
      : "Tu solicitud de Convenio General sigue en revisión";

    const mensaje = fueRechazada
      ? `Tu solicitud #${id} fue revisada y contiene secciones que requieren corrección.`
      : fueAprobada
      ? `Tu solicitud #${id} fue revisada y ha sido aprobada.`
      : `Tu solicitud #${id} sigue en revisión por el administrador.`;

    // 🔹 Crear notificación en BD
    await prisma.notificaciones.create({
      data: {
        usuarios_id: solicitud.creado_por_usuario_id,
        tipo,
        titulo,
        mensaje,
        metadata: { solicitudId: id },
      },
    });

    // 🔹 Enviar correo al solicitante
    await enviarCorreo({
      to: solicitud.creador.correo,
      subject: titulo,
      html: plantillaResultadoRevisionGeneral({
        usuarioNombre: `${solicitud.creador.nombre} ${solicitud.creador.apellido ?? ""}`,
        idSolicitud: id,
        fueRechazada,
        botonUrl: `${baseUrl}/Convenios/Generales/${id}/EstadoSolicitud`,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al notificar solicitante:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
