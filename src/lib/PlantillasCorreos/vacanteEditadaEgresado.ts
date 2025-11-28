// src/lib/plantillas/vacanteEditadaEgresado.ts
import { plantillaCorreoBase } from "./plantillaCorreoBase";

export function plantillaVacanteEditadaEgresado({
  nombreEgresado,
  tituloVacante,
  empresa,
  botonUrl,
}: {
  nombreEgresado: string;
  tituloVacante: string;
  empresa: string;
  botonUrl: string;
}) {
  return plantillaCorreoBase({
    titulo: "🔄 Actualización en una vacante a la que postulaste",
    mensaje: `
      <p>Hola <strong>${nombreEgresado}</strong>,</p>
      <p>Queremos informarte que la empresa <strong>${empresa}</strong> ha actualizado la vacante <strong>"${tituloVacante}"</strong>.</p>
      <p>Es posible que hayan cambiado requisitos, descripción u otros detalles importantes.</p>
      <p>Te recomendamos revisarla nuevamente para asegurarte de que sigue siendo una vacante de tu interés.</p>
    `,
    botonTexto: "Ver vacante actualizada",
    botonUrl,
  });
}
