// src/VinculacionReporte/Contactos/ReporteContactosTemplate.ts
import dayjs from "dayjs";

type Contacto = {
  nombre?: string;
  apellido?: string;
  correo?: string;
  puesto?: string;
  empresas?: { nombre_comercial?: string };
  grupos_id?: number;
  contacto_estados?: { nombre_estado?: string };
  creado_en: string;
};


export function renderReporteContactosHTML(contactos: Contacto[]) {
  const rows = contactos
    .map(
      (c: Contacto) => `
      <tr>
        <td class="cell">${c.nombre ?? "—"}</td>
        <td class="cell">${c.apellido ?? "—"}</td>
        <td class="cell">${c.correo ?? "—"}</td>
        <td class="cell">${c.puesto ?? "—"}</td>
        <td class="cell">${c.empresas?.nombre_comercial ?? "—"}</td>
        <td class="cell">${c.grupos_id ?? "—"}</td>
        <td class="cell">${c.contacto_estados?.nombre_estado ?? "—"}</td>
        <td class="cell">${dayjs(c.creado_en).format("DD/MM/YYYY")}</td>
      </tr>
    `
    )
    .join("");

  return `
  <div style="padding: 32px; font-family: Arial, sans-serif; color: #011848;">
    <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 16px;">
      Reporte de Contactos Registrados
    </h1>
    <p style="text-align: center; font-size: 12px; color: #555;">
      Generado: ${dayjs().format("DD/MM/YYYY HH:mm")}
    </p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 12px;">
      <thead>
        <tr style="background: #011848; color: white;">  
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Correo</th>
          <th>Puesto</th>
          <th>Empresa</th>
          <th>Grupo ID</th>
          <th>Estado</th>
          <th>Creado</th>
        </tr>
      </thead>
      <tbody>
        ${
          rows ||
          `<tr><td colspan="10" style="text-align:center; padding:12px;">No hay contactos para mostrar</td></tr>`
        }
      </tbody>
    </table>

    <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #999;">
      Vinculación de Convenios • TECNM Valladolid – Reporte generado automáticamente
    </div>
  </div>
  `;
}
