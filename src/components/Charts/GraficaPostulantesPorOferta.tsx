// GraficaPostulantesPorOferta.tsx
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
  meses: string[];
}

export default function GraficaPostulantesPorOferta() {
  const [data, setData] = useState<OfertaDashboardData[]>([]);
  const [loading, setLoading] = useState(true);

  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(
          `/api/Ofertas/PostulacioneDashboard?year=${year}`
        );

        if (!resp.ok) {
          console.error("Error API:", resp.status, resp.statusText);
          return;
        }

        const json = await resp.json();
        if (!json.ok) return;

        // Ordenar por mayor número de postulantes
        const ordenado = json.data.sort(
          (a: OfertaDashboardData, b: OfertaDashboardData) =>
            b.postulantes - a.postulantes
        );

        // Limitar a top 10 ofertas
        setData(ordenado.slice(0, 10));
      } catch (e) {
        console.error("Error cargando datos:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  return (
    <div className="bg-white rounded-xl shadow-md w-full p-6 flex flex-col space-y-6">

      {/* TÍTULO */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-green-500 pl-4">
          Postulantes por oferta ({year})
        </h2>
      </div>

      {/* DESCRIPCIÓN */}
      <p className="text-gray-500 text-sm -mt-2">
        Historial anual de postulaciones. Comparativa de postulantes,
        aceptados y rechazados por vacante.
      </p>

      {/* SIN DATOS */}
      {!loading && data.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          No hay postulaciones registradas para este año.
        </p>
      )}

      {/* GRÁFICA */}
      {!loading && data.length > 0 && (
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
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;

                  const d = payload[0].payload as OfertaDashboardData;

                  return (
                    <div className="bg-white border rounded-lg p-3 text-sm shadow">
                      <p className="font-semibold">{d.titulo}</p>

                      <p className="text-gray-500 mt-1">
                        Mes(es):{" "}
                        {Array.isArray(d.meses) && d.meses.length > 0
                          ? d.meses.join(", ")
                          : "Sin postulaciones"}
                      </p>

                      <p>Postulantes: {d.postulantes}</p>
                      <p className="text-green-600">Aceptados: {d.aceptados}</p>
                      <p className="text-red-600">Rechazados: {d.rechazados}</p>
                    </div>
                  );
                }}
              />
              <Legend />

              {/* Postulantes */}
              <Bar
                name="Postulantes"
                dataKey="postulantes"
                fill="#6366F1"
                radius={[8, 8, 0, 0]}
              />

              {/* Aceptados */}
              <Bar
                name="Aceptados"
                dataKey="aceptados"
                fill="#10B981"
                radius={[8, 8, 0, 0]}
              />

              {/* Rechazados */}
              <Bar
                name="Rechazados"
                dataKey="rechazados"
                fill="#EF4444"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

