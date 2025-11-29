import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

type Solicitud = {
  fecha_solicitud: string | null;
  creador?: { nombre: string; apellido?: string };
  tipo?: { nombre_tipo: string };
  estado?: { nombre_estado: string };
  revisor?: { nombre: string; apellido?: string };
};

export function renderReporteSolicitudesHTML(solicitudes: Solicitud[]) {
  const rows = solicitudes
    .map(
      (s: Solicitud) => `
      <tr>
        <td class="cell">${
          s.fecha_solicitud
            ? dayjs.utc(s.fecha_solicitud).format("DD/MM/YYYY")
            : "—"
        }</td>
        <td class="cell">${
          s.creador ? `${s.creador.nombre} ${s.creador.apellido}` : "—"
        }</td>
        <td class="cell">${s.tipo?.nombre_tipo ?? "—"}</td>
        <td class="cell">${s.estado?.nombre_estado ?? "—"}</td>
        <td class="cell">${
          s.revisor ? `${s.revisor.nombre} ${s.revisor.apellido}` : "—"
        }</td>
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
      <h1 class="title">Reporte de Solicitudes de Convenios (No concluidas)</h1>
      <p class="subtitle">Generado: ${dayjs().format("DD/MM/YYYY HH:mm")}</p>
    </div>

    <!-- Tabla -->
    <table>
      <thead>
        <tr>
          <th>Fecha Solicitud</th>
          <th>Solicitante</th>
          <th>Tipo</th>
          <th>Estado</th>
          <th>Revisor</th>
        </tr>
      </thead>

      <tbody>
        ${
          rows ||
          `<tr><td colspan="5" class="no-data">No hay solicitudes para mostrar</td></tr>`
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
