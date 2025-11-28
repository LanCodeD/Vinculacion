"use client";
import React, { useEffect, useState } from "react";

import GraficaOfertasPorMes from "@/components/Charts/GraficaOfertasPorMes";
import GraficaPostulantesPorOferta from "@/components/Charts/GraficaPostulantesPorOferta";

interface Vacante {
  fecha_publicacion: string;
  oferta_estados_id: number;
  _count: { postulaciones: number };
}

export default function BolsaTrabajo() {
  const [ofertasMes, setOfertasMes] = useState(0);
  const [totalPostulaciones, setTotalPostulaciones] = useState(0);
  const [vacantesActivas, setVacantesActivas] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      const resp = await fetch("/api/Ofertas");
      const json = await resp.json();
      if (!json.ok) return;

      const vacantes: Vacante[] = json.vacantes;

      const hoy = new Date();
      const mesActual = hoy.getMonth();
      const añoActual = hoy.getFullYear();

      // 🟦 1. Ofertas publicadas este mes
      const ofertasEsteMes = vacantes.filter(v => {
        const f = new Date(v.fecha_publicacion);
        return (
          f.getMonth() === mesActual &&
          f.getFullYear() === añoActual
        );
      }).length;

      // 🟩 2. Total de postulaciones
      const totalPost = vacantes.reduce(
        (acc, v) => acc + (v._count?.postulaciones || 0),
        0
      );

      // 🟧 3. Vacantes activas (estado 3 = PUBLICADA)
      const activas = vacantes.filter(v => v.oferta_estados_id === 3).length;

      setOfertasMes(ofertasEsteMes);
      setTotalPostulaciones(totalPost);
      setVacantesActivas(activas);
    };

    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Panel del Administrador
          </h1>
          <p className="text-gray-600 mt-1 text-lg">
            Visualización general de actividad, estadísticas y desempeño.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Ofertas este mes</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{ofertasMes}</p>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total de postulaciones</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalPostulaciones}</p>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Vacantes activas</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{vacantesActivas}</p>
          </div>

        </div>

        {/* GRÁFICAS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200">
            <GraficaOfertasPorMes />
          </div>

          <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200">
            <GraficaPostulantesPorOferta />
          </div>
        </div>
      </div>
    </div>
  );
}
