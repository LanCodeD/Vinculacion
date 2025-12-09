import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

type PostulacionSimple = {
  id_postulaciones: number;
  creado_en?: string;
  postulacion_estados_id?: number;
};

type Oferta = {
  titulo: string;
  fecha_publicacion: string | null;
  empresas?: { nombre_comercial: string };
  postulaciones?: PostulacionSimple[];
  oferta_estados_id: number;
};

export function renderReporteOfertasHTML(ofertas: Oferta[]) {
  const estadoTexto: Record<number, string> = {
    3: "Publicada",
    4: "Rechazada",
    5: "Cerrada",
  };

  const rows = ofertas
    .map(
      (o: Oferta) => `
      <tr>
        <td class="cell">${o.titulo}</td>
        <td class="cell">${o.empresas?.nombre_comercial ?? "Sin empresa"}</td>
        <td class="cell">${o.fecha_publicacion
          ? dayjs.utc(o.fecha_publicacion).format("DD/MM/YYYY")
          : "—"
        }</td>
        <td class="cell">${o.postulaciones?.length ?? 0}</td>
        <td class="cell">${estadoTexto[o.oferta_estados_id] ?? "—"}</td>
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
      <h1 class="title">Reporte de Ofertas</h1>
      <p class="subtitle">Generado: ${dayjs().format("DD/MM/YYYY HH:mm")}</p>
    </div>

    <!-- Tabla -->
    <table>
      <thead>
        <tr>
          <th>Título</th>
          <th>Empresa</th>
          <th>Fecha Publicación</th>
          <th>Postulantes</th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        ${rows ||
    `<tr><td colspan="5" class="no-data">No hay ofertas para mostrar</td></tr>`
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
