// src/components/Componentes_vacantes/VacanteCard.tsx
import Link from 'next/link';
import React from 'react';

interface VacanteCardProps {
  id: number;
  titulo: string;
  puesto: string;
  ubicacion: string;
  imagen: string;
  ingenierias?: string[]; // opcional
}

const VacanteCard: React.FC<VacanteCardProps> = ({
  id,
  titulo,
  puesto,
  ubicacion,
  imagen,
  ingenierias = [], // <- agregamos ingenierias
}) => {
  return (
    <div className="xl:w-1/4 md:w-1/2 p-4">
      <div className="bg-gray-100 p-6 rounded-lg border-2 border-gray-200 border-opacity-60 hover:shadow-lg transition duration-300">
        <img
          className="h-40 rounded w-full object-cover object-center mb-6"
          src={imagen}
        />
        <h3 className="tracking-widest text-blue-500 text-xs font-medium title-font">{titulo}</h3>
        <h2 className="text-lg text-gray-900 font-medium title-font mb-4">{puesto}</h2>
        <p className="leading-relaxed text-sm text-gray-600 mb-4">{ubicacion}</p>

        <Link
          href={`/BolsaTrabajo/${id}`}
          className="text-blue-500 inline-flex items-center focus:outline-none hover:underline"
        >
          Más información
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-4 h-4 ml-2"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default VacanteCard;
