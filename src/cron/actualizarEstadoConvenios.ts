import cron from "node-cron";
import { prisma } from "@/lib/prisma";

// 🧩 Tipos de estado
type EstadoConvenio = "ACTIVO" | "PRÓXIMO A VENCER" | "VENCIDO" | "SIN FECHA";

// 🕒 Función que calcula el estado dinámico según la fecha de expiración
function obtenerEstadoDinamico(fechaExpira: Date | string | null): EstadoConvenio {
  if (!fechaExpira) return "SIN FECHA";

  const hoy = new Date();
  const expira = new Date(fechaExpira);
  const diferenciaMeses =
    (expira.getFullYear() - hoy.getFullYear()) * 12 +
    (expira.getMonth() - hoy.getMonth());

  if (expira < hoy) return "VENCIDO";
  if (diferenciaMeses < 6) return "PRÓXIMO A VENCER";
  return "ACTIVO";
}

// 🚀 Función principal que actualiza los convenios
async function actualizarEstadoConvenios() {
  console.log("⏰ Ejecutando cron job: actualización de estados dinámicos...");

  try {
    const convenios = await prisma.convenio_concretado.findMany({
      select: {
        id_convenio_concretado: true,
        fecha_expira: true,
        estado_dinamico: true,
      },
    });

    for (const convenio of convenios) {
      const nuevoEstado = obtenerEstadoDinamico(convenio.fecha_expira);

      if (nuevoEstado !== convenio.estado_dinamico) {
        await prisma.convenio_concretado.update({
          where: { id_convenio_concretado: convenio.id_convenio_concretado },
          data: { estado_dinamico: nuevoEstado, updated_at: new Date() },
        });
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

// (Opcional) Ejecutarlo también una vez al iniciar el servidor
actualizarEstadoConvenios();
