// /lib/PlantillasCorreos/convenioConcretado.ts
import { plantillaCorreoBase } from "./plantillaCorreoBase";

export function plantillaConvenioConcretado({
  usuarioNombre,
  idSolicitud,
  tipoConvenio,
  botonUrl,
}: {
  usuarioNombre: string;
  idSolicitud: number;
  tipoConvenio: string;
  botonUrl: string;
}) {
  return plantillaCorreoBase({
    titulo: `Tu convenio ${tipoConvenio} ha sido concretado`,
    mensaje: `
      <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
        <p style="font-size:15px;">Hola <strong>${usuarioNombre}</strong>,</p>
        
        <p style="font-size:14px; margin-bottom:10px;">
          Nos complace informarte que tu solicitud de convenio <b>${tipoConvenio}</b> 
          <span style="background:#059669; color:#fff; padding:2px 6px; border-radius:4px;">
            #${idSolicitud}
          </span> ha sido firmada y registrada oficialmente en el sistema.
        </p>

        <div style="background:#ecfdf5; border:1px solid #34d399; border-radius:6px; padding:12px; margin:20px 0;">
          <p style="color:#047857; font-weight:bold;">¡Felicidades!</p>
          <p>Tu convenio ya está activo y disponible para consulta.</p>
        </div>

        <p style="margin-top:15px; font-size:14px;">
          Puedes consultar el documento firmado y los detalles completos en el Historial de Solicitudes.
        </p>
      </div>
    `,
    botonTexto: "Ver Historial de Solicitudes",
    botonUrl,
  });
}
