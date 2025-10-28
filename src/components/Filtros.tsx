"use client";
import React, { useState } from "react";

interface FiltrosProps {
  ingenieriasSeleccionadas: number[];
  puestoFiltro: string;
  ubicacionFiltro: string;
}

export default function Filtros({
  ingenieriasSeleccionadas,
  puestoFiltro,
  ubicacionFiltro,
}: FiltrosProps) {
  const [ingenieria, setIngenieria] = useState(ingenieriasSeleccionadas[0] ?? "");
  const [puesto, setPuesto] = useState(puestoFiltro);
  const [ubicacion, setUbicacion] = useState(ubicacionFiltro);

  const aplicarFiltros = () => {
    const params = new URLSearchParams();
    if (ingenieria) params.append("ingenieria", ingenieria.toString());
    if (puesto) params.append("puesto", puesto);
    if (ubicacion) params.append("ubicacion", ubicacion);
    window.location.href = `/BolsaTrabajo?${params.toString()}`;
  };

  return (
    <div className="mb-6 flex flex-wrap gap-4 -mt-15">
      {/* Ingeniería */}
      <div>
        <label className="block mb-2 font-semibold">Ingeniería</label>
        <select
          value={ingenieria}
          onChange={(e) => setIngenieria(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Todas</option>
          <option value="1">Sistemas Computacionales</option>
          <option value="2">Civil</option>
          <option value="3">Administración</option>
          <option value="4">Gestión Empresarial</option>
          <option value="5">Ambiental</option>
          <option value="6">Industrial</option>
        </select>
      </div>

      {/* Puesto */}
      <div>
        <label className="block mb-2 font-semibold">Puesto</label>
        <input
          type="text"
          value={puesto}
          onChange={(e) => setPuesto(e.target.value)}
          placeholder="Buscar por puesto"
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Ubicación */}
      <div>
        <label className="block mb-2 font-semibold">Ubicación</label>
        <input
          type="text"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          placeholder="Buscar por ubicación"
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <button
        onClick={aplicarFiltros}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 self-end"
      >
        Aplicar filtros
      </button>
    </div>
  );
}
