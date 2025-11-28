// src/VinculacionReporte/Convenios/ReporteConveniosTemplate.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export function renderReporteConveniosHTML(convenios: any[]) {
  const rows = convenios
    .map(
      (c: any) => `
      <tr>
        <td class="cell">${c.meta?.nombre ?? "—"}</td>
        <td class="cell">${c.fecha_firmada ? dayjs.utc(c.fecha_firmada).format("DD/MM/YYYY") : "—"}</td>
        <td class="cell">${c.fecha_expira ? dayjs(c.fecha_expira).format("DD/MM/YYYY") : "—"}</td>
        <td class="cell">${c.estado_dinamico ?? "—"}</td>
        <td class="cell">${typeof c.eficiencia === "number" ? `${c.eficiencia} act.` : "—"}</td>
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
      <h1 class="title">Reporte de Convenios Concretados</h1>
      <p class="subtitle">Generado: ${dayjs().format("DD/MM/YYYY HH:mm")}</p>
    </div>

    <!-- Tabla -->
    <table>
      <thead>
        <tr>
          <th>Meta</th>
          <th>Fecha Firmada</th>
          <th>Fecha Expira</th>
          <th>Estado</th>
          <th>Eficiencia</th>
        </tr>
      </thead>

      <tbody>
        ${
          rows ||
          `<tr><td colspan="5" class="no-data">No hay convenios para mostrar</td></tr>`
        }
      </tbody>
    </table>

    <!-- Footer -->
    <div class="footer">
      Vinculación de Convenios • TECNM Valladolid – Reporte generado automáticamente
    </div>
  </body>
  </html>
  `;
}
