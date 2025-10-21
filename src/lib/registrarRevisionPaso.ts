import { prisma } from "@/lib/prisma";

/**
 * Registra un paso como "EN REVISIÓN" (2) si el estado global está en "EN CORRECCIÓN" (5).
 * Evita duplicar registros innecesarios.
 *
 * @param id_solicitud - ID de la solicitud
 * @param paso - Nombre del paso ("Eventos", "Coordinador", etc.)
 * @param usuarioId - ID del usuario que realiza la corrección
 */

export async function registrarRevisionPaso(
  id_solicitud: number,
  paso: string,
  usuarioId: number
): Promise<void> {
  // 🔹 Verificar estado global actual
  const solicitud = await prisma.solicitud_convenios.findUnique({
    where: { id_solicitud },
    select: { estado_id: true },
  });

  if (!solicitud) return;

  // Solo si está en "EN CORRECCIÓN" (5)
  if (solicitud.estado_id === 5) {
    // Buscar el último registro de ese paso
    const ultimo = await prisma.solicitud_estado_historial.findFirst({
      where: { id_solicitud, paso },
      orderBy: { created_at: "desc" },
    });

    // Si el último estado NO es "EN REVISIÓN", crea un nuevo registro
    if (!ultimo || ultimo.estado_id !== 2) {
      await prisma.solicitud_estado_historial.create({
        data: {
          id_solicitud,
          paso,
          estado_id: 2, // EN REVISIÓN
          comentario:
            "El usuario corrigió los datos y los envió nuevamente para revisión",
          cambiado_por_usuario_id: usuarioId,
        },
      });
    }
  }
}
