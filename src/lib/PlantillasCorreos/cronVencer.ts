import { plantillaCorreoBase } from "./plantillaCorreoBase";

export function plantillaConvenioProximoVencerAdmin({
  adminNombre,
  idSolicitud,
  tipoConvenio,
  solicitante,
  mesesRestantes,
  botonUrl,
}: {
  adminNombre: string;
  idSolicitud: number;
  tipoConvenio: string;
  solicitante: string;
  mesesRestantes: number;
  botonUrl: string;
}) {
  return plantillaCorreoBase({
    titulo: `Convenio ${tipoConvenio} próximo a vencer`,
    mensaje: `
      <p>Hola <strong>${adminNombre}</strong>,</p>
      <p>El convenio <b>${tipoConvenio}</b> (#${idSolicitud}) del solicitante <b>${solicitante}</b> vencerá en <b>${mesesRestantes} meses</b>.</p>
      <p>Por favor, revisa los términos y prepara la renovación si es necesario.</p>
    `,
    botonTexto: "Ver Gestión de Convenio",
    botonUrl,
  });
}
