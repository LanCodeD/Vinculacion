"use client";
import React, { useEffect, useState } from "react";

import GraficaOfertasPorMes from "@/components/Charts/GraficaOfertasPorMes";
import GraficaPostulantesPorOferta from "@/components/Charts/GraficaPostulantesPorOferta";
import GraficaConveniosGenerales from "@/components/Charts/GraficaConvenioGeneral";
import GraficaConveniosEspecificos from "@/components/Charts/GraficaConveniosEspecificos";
import GraficaConveniosConcretados from "@/components/Charts/GraficaConveniosConcretados";
import { useSession } from "next-auth/react";
import { FaFileAlt, FaBriefcase } from "react-icons/fa";

interface Vacante {
  fecha_publicacion: string;
  oferta_estados_id: number;
  _count: { postulaciones: number };
}

export default function BolsaTrabajo() {
  const [ofertasMes, setOfertasMes] = useState(0);
  const [totalPostulaciones, setTotalPostulaciones] = useState(0);
  const [vacantesActivas, setVacantesActivas] = useState(0);
  const [kpis, setKpis] = useState<{
    enCorreccion: number;
    finalizadas: number;
    concretados: number;
  } | null>(null);

  const { data: session } = useSession();
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/Convenios/Estadistica/Card-convenio");
      const json = await res.json();
      if (json.ok) setKpis(json.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      const resp = await fetch("/api/Ofertas");
      const json = await resp.json();
      if (!json.ok) return;

      const vacantes: Vacante[] = json.vacantes;

      const hoy = new Date();
      const mesActual = hoy.getMonth();
      const añoActual = hoy.getFullYear();

      // 1. Ofertas publicadas este mes
      const ofertasEsteMes = vacantes.filter((v) => {
        const f = new Date(v.fecha_publicacion);
        return f.getMonth() === mesActual && f.getFullYear() === añoActual;
      }).length;

      // 2. Total de postulaciones
      const totalPost = vacantes.reduce(
        (acc, v) => acc + (v._count?.postulaciones || 0),
        0
      );

      // 3. Vacantes activas (estado 3 = PUBLICADA)
      const activas = vacantes.filter((v) => v.oferta_estados_id === 3).length;

      setOfertasMes(ofertasEsteMes);
      setTotalPostulaciones(totalPost);
      setVacantesActivas(activas);
    };

    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ENCABEZADO CON FONDO GRADIENTE */}
      <div className="bg-linear-to-r from-red-600 via-pink-500 to-orange-400 text-white py-10 px-8 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Panel del Administrador
            </h1>
            <p className="text-lg mt-2 font-light">
              Visualización general de actividad, estadísticas y desempeño.
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-semibold">
              Hola, {session?.user?.nombre || "Sin Nombre"} {session?.user?.apellido || "Sin Apellido"} 👋
            </h2>
            <p className="text-sm text-white/80">Bienvenido de nuevo</p>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-8 py-12 space-y-16">
        {/* SECCIÓN: BOLSA DE TRABAJO */}
        <section className="space-y-10">
          <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-x-3 border-l-4 border-indigo-400 pl-4">
            <FaBriefcase className="text-indigo-700 text-2xl" />
            Bolsa de Trabajo
          </h2>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Ofertas este mes", value: ofertasMes },
              { label: "Total de postulaciones", value: totalPostulaciones },
              { label: "Vacantes activas", value: vacantesActivas },
            ].map((kpi, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow hover:shadow-md transition"
              >
                <h3 className="text-base font-medium text-gray-500">
                  {kpi.label}
                </h3>
                <p className="text-5xl font-bold text-indigo-600 mt-2">
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          {/* GRÁFICAS */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border p-0 border-gray-200 shadow-md">
              <GraficaOfertasPorMes />
            </div>


            <div className="rounded-xl border p-0 border-gray-200 shadow-md">
              <GraficaPostulantesPorOferta />
            </div>
          </div>
        </section>

        {/* SECCIÓN: CONVENIOS */}
        <section className="space-y-10">
          <h2 className="text-3xl font-bold text-pink-700 flex gap-x-3 items-center border-l-4 border-pink-400 pl-4">
            <FaFileAlt className="text-pink-700 text-2xl " /> Estadísticas de
            Convenios
          </h2>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Solicitudes en corrección",
                value: kpis?.enCorreccion ?? 0,
                color: "text-yellow-600",
              },
              {
                label: "Solicitudes finalizadas",
                value: kpis?.finalizadas ?? 0,
                color: "text-blue-600",
              },
              {
                label: "Convenios concretados",
                value: kpis?.concretados ?? 0,
                color: "text-green-600",
              },
            ].map((kpi, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow hover:shadow-md transition"
              >
                <h3 className="text-base font-medium text-gray-500">
                  {kpi.label}
                </h3>
                <p className={`text-5xl font-bold mt-2 ${kpi.color}`}>
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          {/* GRÁFICAS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className=" rounded-xl  border p-0 border-gray-200 shadow-md">
              <GraficaConveniosGenerales />
            </div>
            <div className="rounded-xl p-0 border border-gray-200 shadow-md">
              <GraficaConveniosEspecificos />
            </div>
          </div>

          <div className=" rounded-xl border p-0 border-gray-200 shadow-md">
            <GraficaConveniosConcretados />
          </div>
        </section>
      </div>
    </div>
  );
}
