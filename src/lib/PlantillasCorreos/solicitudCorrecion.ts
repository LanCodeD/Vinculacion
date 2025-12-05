// /lib/PlantillasCorreos/solicitudCorreccion.ts
import { plantillaCorreoBase } from "./plantillaCorreoBase";

export function plantillaSolicitudCorreccion({
  adminNombre,
  usuarioNombre,
  idSolicitud,
  fechaEnvio,
  comentario,
  botonUrl,
}: {
  adminNombre: string;
  usuarioNombre: string;
  idSolicitud: number;
  fechaEnvio?: string;
  comentario?: string;
  botonUrl: string;
}) {
  return plantillaCorreoBase({
    titulo: "Solicitud de Convenio General corregida",
    mensaje: `
      <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
        <p style="font-size:15px;">Hola <strong>${adminNombre}</strong>,</p>
        
        <p style="font-size:14px; margin-bottom:10px;">
          El usuario <strong>${usuarioNombre}</strong> ha corregido la solicitud de Convenio General
          <span style="background:#d97706; color:#fff; padding:2px 6px; border-radius:4px;">
            #${idSolicitud}
          </span> y la ha enviado nuevamente para revisión.
        </p>

        <table style="width:100%; border-collapse:collapse; margin:20px 0; background:#fff7ed; border-radius:6px; border:1px solid #fcd34d;">
          <tr>
            <td style="padding:10px;"><b>ID Solicitud:</b> ${idSolicitud}</td>
          </tr>
          ${
            fechaEnvio
              ? `<tr><td style="padding:10px;"><b>Fecha de reenvío:</b> ${new Date(fechaEnvio).toLocaleDateString()}</td></tr>`
              : ""
          }
          ${
            comentario
              ? `<tr><td style="padding:10px;"><b>Comentario del usuario:</b> ${comentario}</td></tr>`
              : ""
          }
        </table>

        <p style="margin-top:15px; font-size:14px;">
          Por favor, revisa nuevamente esta solicitud en el panel de administración para aprobarla o rechazarla.
        </p>
      </div>
    `,
    botonTexto: "Revisar corrección",
    botonUrl,
  });
}
