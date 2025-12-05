// /lib/PlantillasCorreos/resultadoRevisionGeneral.ts
import { plantillaCorreoBase } from "./plantillaCorreoBase";

export function plantillaResultadoRevisionGeneral({
  usuarioNombre,
  idSolicitud,
  fueRechazada,
  botonUrl,
}: {
  usuarioNombre: string;
  idSolicitud: number;
  fueRechazada: boolean;
  botonUrl: string;
}) {
  return plantillaCorreoBase({
    titulo: fueRechazada
      ? "Correcciones necesarias en tu solicitud de Convenio General"
      : "Tu solicitud de Convenio General ha sido aprobada",
    mensaje: `
      <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
        <p style="font-size:15px;">Hola <strong>${usuarioNombre}</strong>,</p>
        
        <p style="font-size:14px; margin-bottom:10px;">
          Tu solicitud de Convenio General 
          <span style="background:${fueRechazada ? "#d97706" : "#059669"}; color:#fff; padding:2px 6px; border-radius:4px;">
            #${idSolicitud}
          </span> ha sido revisada por el equipo administrativo.
        </p>

        ${
          fueRechazada
            ? `
              <div style="background:#fff7ed; border:1px solid #fcd34d; border-radius:6px; padding:12px; margin:20px 0;">
                <p style="color:#b45309; font-weight:bold;">Se encontraron secciones que requieren corrección.</p>
                <p>Por favor, revisa los comentarios en el panel de administración y corrige los datos antes de reenviar tu solicitud.</p>
              </div>
            `
            : `
              <div style="background:#ecfdf5; border:1px solid #34d399; border-radius:6px; padding:12px; margin:20px 0;">
                <p style="color:#047857; font-weight:bold;">¡Felicidades!</p>
                <p>Tu solicitud ha sido aprobada y puedes continuar con el proceso.</p>
              </div>
            `
        }

        <p style="margin-top:15px; font-size:14px;">
          Puedes consultar el estado completo en el panel de seguimiento.
        </p>
      </div>
    `,
    botonTexto: fueRechazada ? "Revisar correcciones" : "Ver solicitud aprobada",
    botonUrl,
  });
}
