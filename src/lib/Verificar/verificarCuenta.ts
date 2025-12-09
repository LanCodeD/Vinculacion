// /lib/PlantillasCorreos/verificarCuenta.ts
import { plantillaCorreoBase } from "../PlantillasCorreos/plantillaCorreoBase";

export function correoVerificacionCuenta({
  nombreUsuario,
  codigo,
}: {
  nombreUsuario: string;
  codigo: string;
}) {
  return plantillaCorreoBase({
    titulo: "Código de verificación",
    mensaje: `
      <p>Hola <strong>${nombreUsuario}</strong>,</p>
      <p>Tu código de verificación es:</p>
      <h1 style="font-size:32px; letter-spacing:8px; margin: 20px 0;">
        ${codigo}
      </h1>
      <p>Este código expirará en <strong>15 minutos</strong>.</p>
      <p>Si no solicitaste este código, puedes ignorar este mensaje.</p>
    `,
    botonTexto: "Verificar cuenta",
    botonUrl: `${process.env.NEXT_PUBLIC_URL}/verificar-codigo`,
  });
}
