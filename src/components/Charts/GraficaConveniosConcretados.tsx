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

export default function GraficaConveniosConcretados() {
  const [data, setData] = useState<{ mes: string; total: number }[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/Convenios/Estadistica");
      const json = await res.json();
      if (json.ok) setData(json.data);
    }
    fetchData();
  }, []);

  const ultimoMes = data[data.length - 1];

  return (
  <div className="bg-white rounded-xl shadow-md w-full p-6 flex flex-col space-y-6">
    {/* TÍTULO */}
    <div className="flex items-center justify-between w-full">
      <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-4">
        Convenios Concretados
      </h2>
    </div>

    {/* GRÁFICA */}
    <div className="mt-4 w-full h-[260px]">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: 0, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="mes" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip />
          <defs>
            <linearGradient id="concretadosGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="total"
            stroke="#f59e0b"
            strokeWidth={3}
            fill="url(#concretadosGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    {/* RESUMEN DEL MES */}
    {ultimoMes && (
      <div className="mt-6">
        <p className="text-sm text-gray-500">Último mes registrado:</p>
        <h2 className="text-2xl font-bold text-orange-500 mt-1">
          {ultimoMes.total} Convenios Firmados
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Mes: {ultimoMes.mes.toUpperCase()}
        </p>
      </div>
    )}
  </div>
);

}
