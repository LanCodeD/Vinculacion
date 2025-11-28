// src/lib/plantillaCorreoBase.ts
export function plantillaCorreoBase({
  titulo,
  mensaje,
  botonTexto,
  botonUrl,
  colorPrimario = "#004aad",
}: {
  titulo: string;
  mensaje: string;
  botonTexto?: string;
  botonUrl?: string;
  colorPrimario?: string;
}) {
  return `
  <div style="font-family: 'Segoe UI', sans-serif; background-color:#f4f6f8; padding:30px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      
      <div style="background-color:${colorPrimario}; color:white; padding:18px 20px;">
        <h2 style="margin:0;">${titulo}</h2>
      </div>

      <div style="padding:20px; color:#333;">
        ${mensaje}

        ${
          botonUrl
            ? `<a href="${botonUrl}" style="display:inline-block; margin-top:20px; background-color:${colorPrimario}; color:white; text-decoration:none; padding:10px 18px; border-radius:6px;">
                ${botonTexto || "Ver más"}
              </a>`
            : ""
        }

        <hr style="margin:30px 0; border:none; border-top:1px solid #eee;">

        <p style="font-size:12px; color:#999; text-align:center;">
          © ${new Date().getFullYear()} Sistema de Vinculación ITT — Notificación automática.
        </p>
      </div>
    </div>
  </div>`;
}
