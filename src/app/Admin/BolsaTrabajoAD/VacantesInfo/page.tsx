// app/Admin/BolsaTrabajoAD/VacantesInfo/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OfertaResumen {
  id_ofertas: number;
  titulo: string;
  empresa: string;
  estado: string;
}

export default function AdminBolsaTrabajo() {
  const [ofertas, setOfertas] = useState<OfertaResumen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/Admin/BolsaTrabajo/Ofertas")
      .then(res => res.json())
      .then(data => {
        if (data.ok) setOfertas(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-6">Cargando ofertas...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Bolsa de Trabajo</h1>

      <div className="py-4 overflow-x-auto sm:px-6 lg:px-0">
        <div className="inline-block min-w-full shadow-lg overflow-hidden rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Detalle
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {ofertas.map((o) => (
                <tr key={o.id_ofertas} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-blue-900 font-medium">{o.titulo}</td>

                  <td className="px-6 py-4 text-blue-900">
                    {o.empresa ?? "Sin empresa"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`
                  px-3 py-1 rounded-full text-xs font-semibold border
                  ${o.estado === "Activo"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : o.estado === "Inactivo"
                            ? "bg-red-100 text-red-800 border-red-300"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        }
                `}
                    >
                      {o.estado}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/Admin/BolsaTrabajoAD/VacantesInfo/${o.id_ofertas}`}
                      className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors text-sm"
                    >
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))}

              {ofertas.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                    No se encontraron ofertas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
