import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enviarCorreo } from "@/lib/mailer";
import { plantillaOfertaCerrada } from "@/lib/PlantillasCorreos/plantillaOfertaCerrada";

export async function GET() {
  try {
    const hoy = new Date();

    // 1️⃣ Obtener todas las PUBLICADAS cuyo cierre ya venció
    const vencidas = await prisma.ofertas.findMany({
      where: {
        fecha_cierre: { lt: hoy },
        oferta_estados_id: 3, // PUBLICADA
      },
      include: {
        empresas: true, // para enviar correos a la empresa
      }
    });

    if (vencidas.length === 0) {
      return NextResponse.json({
        ok: true,
        mensaje: "No había ofertas por cerrar.",
      });
    }

    // 2️⃣ Cerrar todas las vacantes
    await prisma.ofertas.updateMany({
      where: { id_ofertas: { in: vencidas.map(v => v.id_ofertas) } },
      data: { oferta_estados_id: 5 }, // CERRADA
    });

    // 3️⃣ (Opcional) enviar correos a empresas
    for (const oferta of vencidas) {
      if (oferta.empresas.correo_empresas) {
        try {
          await enviarCorreo({
            to: oferta.empresas.correo_empresas,
            subject: "Tu vacante ha sido cerrada automáticamente",
            html: plantillaOfertaCerrada({
              empresa: oferta.empresas.nombre_comercial,
              titulo: oferta.titulo,
              fecha_cierre: oferta.fecha_cierre,
            }),
          });
        } catch (err) {
          console.error("❌ Error enviando correo:", err);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      mensaje: "Vacantes cerradas correctamente",
      cerradas: vencidas.length,
      fecha: hoy,
    });
  } catch (error) {
    console.error("❌ Error en CRON cerrar-ofertas:", error);
    return NextResponse.json(
      { ok: false, error: "Error al ejecutar cron" },
      { status: 500 }
    );
  }
}
