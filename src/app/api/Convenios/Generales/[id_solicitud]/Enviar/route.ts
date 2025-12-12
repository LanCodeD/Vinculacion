import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { enviarCorreo } from "@/lib/mailer";
import { plantillaSolicitudRevision } from "@/lib/PlantillasCorreos/solicitudRevision";
import { plantillaSolicitudCorreccion } from "@/lib/PlantillasCorreos/solicitudCorrecion"; // 👈 nueva plantilla

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id_solicitud: string }> }
) {
  const { id_solicitud } = await context.params;
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  try {
    const usuario = await getSessionUser();
    if (!usuario)
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const id = parseInt(id_solicitud, 10);
    if (Number.isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    // Verificar propiedad y estado actual
    const solicitud = await prisma.solicitud_convenios.findUnique({
      where: { id_solicitud: id },
      select: { creado_por_usuario_id: true, estado_id: true },
    });

    if (!solicitud)
      return NextResponse.json(
        { error: "No existe la solicitud" },
        { status: 404 }
      );
    if (solicitud.creado_por_usuario_id !== usuario.id)
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    // … lógica de validación de pasos …

    // Determinar tipo de notificación según estado actual
    let tipoNotificacion = "solicitud_revision";
    let tituloNotificacion =
      "Nueva solicitud de Convenio General enviada para revisión";
    let mensajeNotificacion = `El usuario ${usuario.nombre} ${usuario.apellido} ha enviado la solicitud #${id} de Convenio General para revisión.`;
    let subjectCorreo = "Nueva solicitud de Convenio General para revisión";
    let plantillaCorreo = plantillaSolicitudRevision;

    if (solicitud.estado_id === 5) {
      tipoNotificacion = "solicitud_correccion";
      tituloNotificacion = "Solicitud de Convenio General corregida";
      mensajeNotificacion = `El usuario ${usuario.nombre} ${usuario.apellido} ha corregido la solicitud #${id} de Convenio General y la ha enviado nuevamente para revisión.`;
      subjectCorreo = "Solicitud de Convenio General corregida";
      plantillaCorreo = plantillaSolicitudCorreccion;
    }

    // Actualizar estado global a EN REVISIÓN (2)
    await prisma.solicitud_convenios.update({
      where: { id_solicitud: id },
      data: { estado_id: 2 },
    });

    // Registrar evento en historial
    await prisma.solicitud_estado_historial.create({
      data: {
        id_solicitud: id,
        estado_id: 2,
        cambiado_por_usuario_id: usuario.id,
        comentario: tituloNotificacion,
      },
    });

    // 🔔 Notificaciones a admins y subadmins
    const admins = await prisma.usuarios.findMany({
      where: { roles_id: { in: [4, 5] } },
    });

    for (const admin of admins) {
      // Crear notificación en BD
      await prisma.notificaciones.create({
        data: {
          usuarios_id: admin.id_usuarios,
          tipo: tipoNotificacion,
          titulo: tituloNotificacion,
          mensaje: mensajeNotificacion,
          metadata: { solicitudId: id },
        },
      });

      // Enviar correo
      if (admin.correo) {
        try {
          await enviarCorreo({
            to: admin.correo,
            subject: subjectCorreo,
            html: plantillaCorreo({
              adminNombre: `${admin.nombre} ${admin.apellido ?? ""}`,
              usuarioNombre: `${usuario.nombre} ${usuario.apellido ?? ""}`,
              fechaEnvio: new Date().toISOString(),
              idSolicitud: id,
              botonUrl: `${baseUrl}/Admin/Convenios/Generales/${id}/EstadoSolicitud`,
            }),
          });
          console.log("📧 Correo enviado a admin:", admin.correo);
        } catch (err) {
          console.error("❌ Error al enviar correo:", admin.correo, err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      mensaje: "Solicitud enviada correctamente y notificaciones enviadas",
    });
  } catch (error) {
    console.error("Error al enviar solicitud:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
