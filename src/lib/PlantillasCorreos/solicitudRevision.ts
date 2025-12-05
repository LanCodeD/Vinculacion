// /lib/PlantillasCorreos/solicitudRevision.ts
import { plantillaCorreoBase } from "./plantillaCorreoBase";

export function plantillaSolicitudRevision({
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
    titulo: "Nueva solicitud enviada para revisión",
    mensaje: `
      <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
        <p style="font-size:15px;">Hola <strong>${adminNombre}</strong>,</p>
        
        <p style="font-size:14px; margin-bottom:10px;">
          El usuario <strong>${usuarioNombre}</strong> ha enviado la solicitud de un Convenio General
          <span style="background:#011848; color:#fff; padding:2px 6px; border-radius:4px;">
            #${idSolicitud}
          </span> para revisión.
        </p>

        <table style="width:100%; border-collapse:collapse; margin:20px 0; background:#f9f9f9; border-radius:6px;">
          <tr>
            <td style="padding:10px;"><b>ID Solicitud:</b> ${idSolicitud}</td>
          </tr>
          ${
            fechaEnvio
              ? `<tr><td style="padding:10px;"><b>Fecha de envío:</b> ${new Date(fechaEnvio).toLocaleDateString()}</td></tr>`
              : ""
          }
          ${
            comentario
              ? `<tr><td style="padding:10px;"><b>Comentario:</b> ${comentario}</td></tr>`
              : ""
          }
        </table>

        <p style="margin-top:15px; font-size:14px;">
          Por favor, revisa esta solicitud en el panel de administración para aprobarla o rechazarla.
        </p>
      </div>
    `,
    botonTexto: "Revisar solicitud",
    botonUrl,
  });
}
