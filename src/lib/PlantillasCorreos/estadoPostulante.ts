// src/lib/plantillas/estadoPostulante.ts
import { plantillaCorreoBase } from "@/lib/PlantillasCorreos/plantillaCorreoBase";

export function plantillaEstadoPostulante({
  nombreEgresado,
  tituloVacante,
  empresa,
  estado, // "aprobada" | "rechazada" | "revision"
  botonUrl,
}: {
  nombreEgresado: string;
  tituloVacante: string;
  empresa: string;
  estado: "aprobada" | "rechazada" | "revision";
  botonUrl: string;
}) {
  const mensajes = {
    aprobada: {
      titulo: "¡Tu postulación fue aprobada!",
      mensaje: `
        <p>Hola <strong>${nombreEgresado}</strong>,</p>
        <p>¡Buenas noticias! Tu postulación a la vacante <strong>"${tituloVacante}"</strong> en <strong>${empresa}</strong> ha sido <b>aprobada</b>.</p>
        <p>Muy pronto podrían ponerse en contacto contigo para continuar con el proceso.</p>
      `,
      boton: "Ver postulación",
    },
    rechazada: {
      titulo: "Tu postulación fue rechazada",
      mensaje: `
        <p>Hola <strong>${nombreEgresado}</strong>,</p>
        <p>Lamentamos informarte que tu postulación a la vacante <strong>"${tituloVacante}"</strong> en <strong>${empresa}</strong> fue <b>rechazada</b>.</p>
        <p>Te invitamos a seguir postulando a más vacantes dentro del sistema.</p>
      `,
      boton: "Ver detalles",
    },
    revision: {
      titulo: "🔍 Tu postulación está en revisión",
      mensaje: `
        <p>Hola <strong>${nombreEgresado}</strong>,</p>
        <p>Tu postulación a la vacante <strong>"${tituloVacante}"</strong> en <strong>${empresa}</strong> está en proceso de revisión.</p>
        <p>Serás notificado cuando exista una actualización.</p>
      `,
      boton: "Ver seguimiento",
    },
  };

  const info = mensajes[estado];

  return plantillaCorreoBase({
    titulo: info.titulo,
    mensaje: info.mensaje,
    botonTexto: info.boton,
    botonUrl,
  });
}
