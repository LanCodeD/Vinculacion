// src/components/TablaVacantes.tsx
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

type Vacante = {
  id_ofertas: number;
  titulo: string;
  puesto: string | null;
  empresas: { nombre_comercial: string;
    correo: string | null;
    telefono: string | null;
   } | null;
  estado: { nombre_estado: string } | null;
};

type Props = {
  vacantes: Vacante[];
};

export default function TablaVacantes({ vacantes }: Props) {
  const [search, setSearch] = useState('');

  // Filtrado y orden ascendente por ID
  const vacantesFiltradas = useMemo(() => {
    return vacantes
      .filter((v) =>
        v.titulo.toLowerCase().includes(search.toLowerCase()) ||
        v.empresas?.nombre_comercial.toLowerCase().includes(search.toLowerCase()) ||
        v.estado?.nombre_estado.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => a.id_ofertas - b.id_ofertas); // Orden ascendente por ID
  }, [search, vacantes]);

  const estadoBadge = (estado: string | undefined) => {
    switch (estado?.toLowerCase()) {
      case 'PUBLICADA':
        return <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">{estado}</span>;
      case 'RECHAZADA':
        return <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">{estado}</span>;
      case 'PENDIENTE_REVISION':
        return <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold">{estado}</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold">{estado}</span>;
    }
  };

  return (
    <div className="py-4 overflow-x-auto sm:px-6 lg:px-0">
      {/* Buscador */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar vacante, empresa o estado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-7/12 px-4 py-2 rounded-lg shadow-md focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-700 text-sm placeholder-gray-400"
        />
      </div>

      {/* Tabla */}
      <div className="inline-block min-w-full shadow-lg overflow-hidden rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Empresa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vacantesFiltradas.map((v) => (
              <tr key={v.id_ofertas} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-blue-900">{v.titulo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-900">{v.empresas?.nombre_comercial ?? 'Sin empresa'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{v.empresas?.correo ?? 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{v.empresas?.telefono ?? 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{estadoBadge(v.estado?.nombre_estado)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    href={`/Admin/BolsaTrabajoAD/${v.id_ofertas}`}
                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors text-sm"
                  >
                    Ver detalles
                  </Link>
                </td>
              </tr>
            ))}
            {vacantesFiltradas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
