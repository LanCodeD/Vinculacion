// src/lib/plantillas/nuevaVacante.ts
import { plantillaCorreoBase } from "../lib/plantillaCorreoBase";

export function plantillaNuevaVacante({
  adminNombre,
  empresaNombre,
  tituloVacante,
  puesto,
  ubicacion,
  horario,
  modalidad,
  fecha_cierre,
  descripcion,
  botonUrl,
}: {
  adminNombre: string;
  empresaNombre: string;
  tituloVacante: string;
  puesto?: string;
  ubicacion?: string;
  horario?: string;
  modalidad?: string;
  fecha_cierre?: string;
  descripcion?: string;
  botonUrl: string;
}) {
  return plantillaCorreoBase({
    titulo: "Nueva vacante pendiente de aprobación",
    mensaje: `
      <p>Hola <strong>${adminNombre}</strong>,</p>
      <p>La empresa <strong>${empresaNombre}</strong> ha creado una nueva vacante pendiente de revisión.</p>
      <table style="width:100%; border-collapse:collapse; margin-top:15px;">
        <tr><td style="padding:6px 0;"><b>Título:</b> ${tituloVacante}</td></tr>
        ${puesto ? `<tr><td style="padding:6px 0;"><b>Puesto:</b> ${puesto}</td></tr>` : ""}
        ${ubicacion ? `<tr><td style="padding:6px 0;"><b>Ubicación:</b> ${ubicacion}</td></tr>` : ""}
        ${horario ? `<tr><td style="padding:6px 0;"><b>Horario:</b> ${horario}</td></tr>` : ""}
        ${modalidad ? `<tr><td style="padding:6px 0;"><b>Modalidad:</b> ${modalidad}</td></tr>` : ""}
        ${
          fecha_cierre
            ? `<tr><td style="padding:6px 0;"><b>Cierra el:</b> ${new Date(fecha_cierre).toLocaleDateString()}</td></tr>`
            : ""
        }
      </table>

      ${descripcion ? `<p style="margin-top:10px;"><b>Descripción:</b> ${descripcion}</p>` : ""}

      <p>Por favor, revisa esta vacante en el panel de administración para aprobarla o rechazarla.</p>
    `,
    botonTexto: "Revisar vacante",
    botonUrl,
  });
}
