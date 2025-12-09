import { plantillaCorreoBase } from "./plantillaCorreoBase";

export function correoNuevaPostulacion({
  nombreEmpresa,
  tituloOferta,
  urlPanel,
}: {
  nombreEmpresa: string;
  tituloOferta: string;
  urlPanel: string;
}) {
  return plantillaCorreoBase({
    titulo: "Nueva postulación recibida",
    mensaje: `
      <p>Hola <strong>${nombreEmpresa}</strong>,</p>
      <p>Un egresado se ha postulado a tu vacante:</p>
      <p style="font-size:16px;"><strong>${tituloOferta}</strong></p>
      <p>Puedes revisar los detalles desde tu panel empresarial.</p>
    `,
    botonTexto: "Ver postulación",
    botonUrl: urlPanel,
  });
}
