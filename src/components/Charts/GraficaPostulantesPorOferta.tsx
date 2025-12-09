"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface OfertaDashboardData {
  titulo: string;
  postulantes: number;
  aceptados: number;
  rechazados: number;
  [key: string]: unknown;
}

export default function GraficaPostulantesPorOferta() {
  const [data, setData] = useState<OfertaDashboardData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch("/api/Ofertas/PostulacioneDashboard");

        if (!resp.ok) {
          console.error("❌ Error API:", resp.status, resp.statusText);
          return;
        }

        const json = await resp.json();
        if (!json.ok) return;

        const ordenado = json.data.sort(
          (a: OfertaDashboardData, b: OfertaDashboardData) =>
            b.postulantes - a.postulantes
        );

        setData(ordenado);
      } catch (e) {
        console.error("❌ Error cargando datos:", e);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md w-full p-6 flex flex-col space-y-6">

      {/* TÍTULO ESTILO PROFESIONAL VERDE */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-green-500 pl-4">
          Postulantes por oferta
        </h2>
      </div>

      <p className="text-gray-500 text-sm -mt-2">
        Comparativa de postulantes, aceptados y rechazados por vacante.
      </p>

      {/* GRÁFICA */}
      <div className="w-full h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />

            <XAxis
              dataKey="titulo"
              angle={-20}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fontSize: 12 }}
            />

            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                padding: "8px 12px",
                background: "white",
                border: "1px solid #e5e7eb",
              }}
            />

            <Legend />

            {/* 🔵 Total postulantes */}
            <Bar
              name="Postulantes"
              dataKey="postulantes"
              fill="#6366F1"
              radius={[8, 8, 0, 0]}
            />

            {/* 🟢 Aceptados */}
            <Bar
              name="Aceptados"
              dataKey="aceptados"
              fill="#10B981"
              radius={[8, 8, 0, 0]}
            />

            {/* 🔴 Rechazados */}
            <Bar
              name="Rechazados"
              dataKey="rechazados"
              fill="#EF4444"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
