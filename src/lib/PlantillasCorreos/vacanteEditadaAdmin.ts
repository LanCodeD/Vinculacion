// src/lib/plantillas/vacanteEditadaAdmin.ts
import { plantillaCorreoBase } from "./plantillaCorreoBase";

export function plantillaVacanteEditadaAdmin({
  adminNombre,
  empresaNombre,
  tituloVacante,
  botonUrl,
}: {
  adminNombre: string;
  empresaNombre: string;
  tituloVacante: string;
  botonUrl: string;
}) {
  return plantillaCorreoBase({
    titulo: "⚠️ Vacante actualizada — Revisión requerida",
    mensaje: `
      <p>Hola <strong>${adminNombre}</strong>,</p>
      <p>La empresa <strong>${empresaNombre}</strong> ha actualizado la vacante <strong>"${tituloVacante}"</strong>.</p>
      <p>La vacante ha sido enviada nuevamente al estado <strong>En Revisión</strong>.</p>
      <p>Por favor revisa la información para aprobarla o rechazarla.</p>
    `,
    botonTexto: "Revisar vacante",
    botonUrl,
  });
}
