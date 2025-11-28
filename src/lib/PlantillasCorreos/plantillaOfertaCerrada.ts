import { plantillaCorreoBase } from "./plantillaCorreoBase";

export function plantillaOfertaCerrada({
  empresa,
  titulo,
  fecha_cierre,
  botonUrl,
}: {
  empresa: string;
  titulo: string;
  fecha_cierre: Date | null;  // <-- acepta null sin problemas
  botonUrl?: string;
}) {
  const fechaTexto = fecha_cierre
    ? fecha_cierre.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Sin fecha definida";

  return plantillaCorreoBase({
    titulo: "📌 Tu vacante ha sido cerrada automáticamente",
    mensaje: `
      <p>Hola <strong>${empresa}</strong>,</p>

      <p>La vacante <strong>"${titulo}"</strong> ha sido cerrada automáticamente.</p>

      <p><strong>Fecha de cierre:</strong> ${fechaTexto}</p>

      <p>Esta vacante ya no recibirá nuevas postulaciones.</p>
    `,
    botonTexto: botonUrl ? "Ver vacante" : undefined,
    botonUrl,
  });
}
