import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

type Postulacion = {
  usuario: { nombre: string; apellido: string };
  oferta: { titulo: string; empresas: { nombre_comercial: string } };
  estado: { nombre_estado: string };
  revisado_en: string | null;
  mensaje: string | null;
};

type ReportePostulaciones = {
  total: number;
  porEstado: {
    pendientes: number;
    aceptados: number;
    rechazados: number;
  };
  postulaciones: Postulacion[];
  rango: { inicio: string; fin: string };
};

export function renderReportePostulacionesHTML(reporte: ReportePostulaciones) {
  const rows = reporte.postulaciones
    .map(
      (p) => `
      <tr>
        <td class="cell">${p.oferta.empresas?.nombre_comercial ?? "Sin empresa"}</td>
        <td class="cell">${p.oferta.titulo}</td>
        <td class="cell">${p.usuario.nombre} ${p.usuario.apellido}</td>
        <td class="cell">${p.estado.nombre_estado}</td>
        <td class="cell">${
          p.revisado_en ? dayjs.utc(p.revisado_en).format("DD/MM/YYYY") : "Sin revisar"
        }</td>
        <td class="cell text-red-600 italic">${p.mensaje ?? "—"}</td>
      </tr>
    `
    )
    .join("");

  return `
  <html>
  <head>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial;
        padding: 32px;
        color: #011848;
        background: #ffffff;
      }

      .header {
        text-align: center;
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 3px solid #011848;
      }

      .title {
        font-size: 26px;
        font-weight: bold;
        margin: 0;
        color: #011848;
      }

      .subtitle {
        font-size: 12px;
        color: #555;
        margin-top: 4px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 24px;
        font-size: 12px;
      }

      thead tr {
        background: #011848;
        color: white;
      }

      th {
        padding: 10px;
        text-align: left;
        border: 1px solid #d1d5db;
        font-weight: bold;
      }

      .cell {
        padding: 8px;
        border: 1px solid #e5e7eb;
        background: #f9fafb;
      }

      tr:nth-child(even) .cell {
        background: #f1f5f9;
      }

      .text-red-600 {
        color: #dc2626;
      }

      .italic {
        font-style: italic;
      }

      .no-data {
        text-align: center;
        padding: 12px;
        color: #777;
      }

      .footer {
        margin-top: 40px;
        text-align: center;
        font-size: 10px;
        color: #999;
      }
    </style>
  </head>

  <body>
    <!-- Header -->
    <div class="header">
      <h1 class="title">Reporte de Postulaciones</h1>
      <p class="subtitle">Generado: ${dayjs().format("DD/MM/YYYY HH:mm")}</p>
      <p class="subtitle">Rango: ${dayjs.utc(reporte.rango.inicio).format("DD/MM/YYYY")} - ${dayjs
    .utc(reporte.rango.fin)
    .format("DD/MM/YYYY")}</p>
    </div>

    <!-- Tabla -->
    <table>
      <thead>
        <tr>
          <th>Empresa</th>
          <th>Vacante</th>
          <th>Egresado</th>
          <th>Estado</th>
          <th>Fecha de revisión</th>
          <th>Mensaje rechazo</th>
        </tr>
      </thead>

      <tbody>
        ${
          rows ||
          `<tr><td colspan="6" class="no-data">No hay postulaciones para mostrar</td></tr>`
        }
      </tbody>
    </table>

    <!-- Footer -->
    <div class="footer">
      Bolsa de Trabajo • TECNM Valladolid – Reporte generado automáticamente
    </div>
  </body>
  </html>
  `;
}
