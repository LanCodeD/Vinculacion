"use client";

import { useEffect, useState } from "react";

interface Postulacion {
  id_postulacion: number;
  nombre: string;
  correo: string;
  estado: string;
  estadoId: number; // Para colores condicionales
}

interface Oferta {
  id: number;
  titulo: string;
  empresa: string;
}

interface Props {
  ofertaId: number;
  onClose: () => void;
}

export default function DetallePostulaciones({ ofertaId, onClose }: Props) {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [oferta, setOferta] = useState<Oferta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/Admin/BolsaTrabajo/Ofertas/${ofertaId}/Postulaciones`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setPostulaciones(data.postulaciones);
          setOferta(data.oferta);
        }
      })
      .finally(() => setLoading(false));
  }, [ofertaId]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <p className="bg-white p-6 rounded-lg shadow-lg animate-pulse">
          Cargando postulaciones...
        </p>
      </div>
    );

  if (!oferta)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <p className="bg-white p-6 rounded-lg shadow-lg">Oferta no encontrada</p>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {oferta.titulo} - {oferta.empresa}
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Cerrar
          </button>
        </div>

        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Nombre</th>
              <th className="px-4 py-2 text-left text-gray-700">Correo</th>
              <th className="px-4 py-2 text-left text-gray-700">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {postulaciones.map(p => (
              <tr key={p.id_postulacion} className="hover:bg-gray-50">
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2">{p.correo}</td>
                <td
                  className={`px-4 py-1 text-sm font-semibold rounded-full w-fit ${
                    p.estadoId === 3
                      ? "bg-green-100 text-green-800"
                      : p.estadoId === 4
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {p.estado}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
