"use client";
import Link from "next/link";
import React from "react";

interface VacanteCardProps {
  id: number;
  titulo: string;
  puesto: string;
  descripcion: string;
  imagen: string;
  estado?: number;
  showActions?: boolean;
  onDelete?: (id: number) => void;
}

const estadoEstilos: Record<number, string> = {
  2: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  3: "bg-green-100 text-green-700 border border-green-300",
  4: "bg-red-100 text-red-700 border border-red-300",
};

const estadoTexto: Record<number, string> = {
  2: "Pendiente de revisión",
  3: "Publicada",
  4: "Rechazada",
};

const VacanteCard: React.FC<VacanteCardProps> = ({
  id,
  titulo,
  puesto,
  descripcion,
  imagen,
  estado,
  showActions = false,
  onDelete,
}) => {
  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-full">
        {/* Imagen */}
        <img
          className="h-44 rounded-lg w-full object-cover object-center mb-4"
          src={imagen}
        />

        {/* Contenido */}
        <div>
          <h3 className="text-sm text-blue-600 font-semibold">{titulo}</h3>
          <h2 className="text-lg text-gray-900 font-medium title-font mb-2">
            {puesto}
          </h2>
          <p className="leading-relaxed text-sm text-gray-600 line-clamp-3">
            {descripcion}
          </p>
        </div>

        {/* Estado de la oferta */}
        {estado && (
          <div
            className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-medium text-center self-start ${estadoEstilos[estado]}`}
          >
            {estadoTexto[estado]}
          </div>
        )}

        {/* Acciones */}
        {showActions && (
          <div className="mt-4 flex gap-2">
            <Link
              href={`EditarVacantes/${id}`}
              className="flex-1 bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-3 rounded-lg text-center transition"
            >
              Editar
            </Link>
            <button
              onClick={() => onDelete?.(id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-3 rounded-lg transition"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacanteCard;
