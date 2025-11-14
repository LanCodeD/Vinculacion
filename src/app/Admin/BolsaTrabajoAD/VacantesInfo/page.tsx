"use client";

import { useEffect, useState } from "react";
import DetallePostulaciones from "@/components/Componentes_administrador/DetallePostulaciones";

interface OfertaResumen {
  id_ofertas: number;
  titulo: string;
  empresa: string;
  estado: string;
}

export default function AdminBolsaTrabajo() {
  const [ofertas, setOfertas] = useState<OfertaResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [detalleOfertaId, setDetalleOfertaId] = useState<number | null>(null);

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

      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Título", "Empresa", "Estado", "Detalle"].map(th => (
                <th key={th} className="px-4 py-2 text-left text-gray-700">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ofertas.map(o => (
              <tr key={o.id_ofertas} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{o.titulo}</td>
                <td className="px-4 py-2">{o.empresa}</td>
                <td className="px-4 py-2">{o.estado}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setDetalleOfertaId(o.id_ofertas)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Ver postulaciones
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detalleOfertaId && (
        <DetallePostulaciones
          ofertaId={detalleOfertaId}
          onClose={() => setDetalleOfertaId(null)}
        />
      )}
    </div>
  );
}
