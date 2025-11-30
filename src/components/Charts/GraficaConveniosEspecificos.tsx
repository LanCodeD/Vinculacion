"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(m => m.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(m => m.CartesianGrid), { ssr: false });

export default function GraficaConveniosEspecificos() {
  const [data, setData] = useState<{ mes: string; total: number }[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/Convenios/Estadistica/Especifico");
      const json = await res.json();
      if (json.ok) setData(json.data);
    }
    fetchData();
  }, []);

  const ultimoMes = data[data.length - 1];

  return (
    <div className="bg-white rounded-xl shadow-md w-full p-6 flex flex-col space-y-6">
      
        <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-cyan-600 pl-4">
            Solicitudes de Convenios Específicos
          </h2>
        </div>

        <div className="mt-4 w-full h-[260px]">
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="mes" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip />
              <defs>
                <linearGradient id="especificosGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5FC3D6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#5FC3D6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="total"
                stroke="#5FC3D6"
                strokeWidth={3}
                fill="url(#especificosGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      

      {ultimoMes && (
        <div className="mt-6">
          <p className="text-sm text-gray-500">Último mes registrado:</p>
          <h2 className="text-2xl font-bold text-cyan-600 mt-1">
            {ultimoMes.total} Solicitudes
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Mes: {ultimoMes.mes.toUpperCase()}
          </p>
        </div>
      )}
    </div>
  );
}
