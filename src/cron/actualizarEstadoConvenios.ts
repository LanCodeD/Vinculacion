import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import { plantillaConvenioProximoVencerAdmin } from "@/lib/PlantillasCorreos/cronVencer";
import { enviarCorreo } from "@/lib/mailer";

// 🧩 Tipos de estado
type EstadoConvenio = "ACTIVO" | "PRÓXIMO A VENCER" | "VENCIDO" | "SIN FECHA";

// 🕒 Función que calcula el estado dinámico según la fecha de expiración
function obtenerEstadoDinamico(fechaExpira: Date | string | null): EstadoConvenio {
  if (!fechaExpira) return "SIN FECHA";

  const hoy = new Date();
  const expira = new Date(fechaExpira);

  // ✅ Paso 1: cálculo más preciso con días
  const diffTime = expira.getTime() - hoy.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diferenciaMeses = Math.floor(diffDays / 30); // aproximación a meses

  if (expira < hoy) return "VENCIDO";
  if (diferenciaMeses < 6) return "PRÓXIMO A VENCER";
  return "ACTIVO";
}

// 🚀 Función principal que actualiza los convenios
async function actualizarEstadoConvenios() {
  console.log("⏰ Ejecutando cron job: actualización de estados dinámicos...");
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  try {
    const convenios = await prisma.convenio_concretado.findMany({
      select: {
        id_convenio_concretado: true,
        fecha_expira: true,
        estado_dinamico: true,
        solicitud: {
          select: {
            id_solicitud: true,
            tipo: { select: { nombre_tipo: true } },
            creador: { select: { nombre: true, apellido: true } },
          },
        },
      },
    });

    const hoy = new Date();

    for (const convenio of convenios) {
      const nuevoEstado = obtenerEstadoDinamico(convenio.fecha_expira);

      // 1️⃣ Actualizar estado si cambió
      if (nuevoEstado !== convenio.estado_dinamico) {
        await prisma.convenio_concretado.update({
          where: { id_convenio_concretado: convenio.id_convenio_concretado },
          data: { estado_dinamico: nuevoEstado, updated_at: new Date() },
        });
      }

      // 2️⃣ Calcular diferencia en meses con días
      if (convenio.fecha_expira) {
        const expira = new Date(convenio.fecha_expira);
        const diffTime = expira.getTime() - hoy.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diferenciaMeses = Math.floor(diffDays / 30);

        // 3️⃣ Notificar administradores solo en hitos (6 meses o 2 meses)
        if (diferenciaMeses === 6 || diferenciaMeses === 2) {
          const admins = await prisma.usuarios.findMany({
            where: { roles_id: { in: [4, 5] } }, // 4 y 5 = admin/subadmin
          });

          for (const admin of admins) {
            await prisma.notificaciones.create({
              data: {
                usuarios_id: admin.id_usuarios,
                tipo: "convenio_proximo_vencer_admin",
                titulo: `Convenio ${convenio.solicitud?.tipo?.nombre_tipo} próximo a vencer`,
                mensaje: `El convenio #${convenio.solicitud?.id_solicitud} del solicitante ${convenio.solicitud?.creador?.nombre} ${convenio.solicitud?.creador?.apellido ?? ""} vencerá en ${diferenciaMeses} meses.`,
                metadata: { convenioId: convenio.id_convenio_concretado },
              },
            });

            if (admin.correo) {
              await enviarCorreo({
                to: admin.correo,
                subject: `Convenio ${convenio.solicitud?.tipo?.nombre_tipo} próximo a vencer`,
                html: plantillaConvenioProximoVencerAdmin({
                  adminNombre: `${admin.nombre} ${admin.apellido ?? ""}`,
                  idSolicitud: convenio.solicitud?.id_solicitud,
                  tipoConvenio: convenio.solicitud?.tipo?.nombre_tipo,
                  solicitante: `${convenio.solicitud?.creador?.nombre} ${convenio.solicitud?.creador?.apellido ?? ""}`,
                  mesesRestantes: diferenciaMeses,
                  botonUrl: `${baseUrl}/Admin/Convenios/Concretados`,
                }),
              });
            }
          }
        }
      }
    }

    console.log("✅ Actualización completada correctamente.");
  } catch (error) {
    console.error("❌ Error al actualizar los estados dinámicos:", error);
  }
}

// 🔁 Ejecutar el cron job cada día a las 00:00 hrs (hora de México)
cron.schedule("0 0 * * *", actualizarEstadoConvenios, {
  timezone: "America/Mexico_City",
});

// ❌ Paso 2: quitar ejecución inmediata al iniciar el servidor
// actualizarEstadoConvenios();
