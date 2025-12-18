"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// IMPORTS DINÁMICOS DE RECHARTS
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(m => m.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(m => m.CartesianGrid), { ssr: false });

interface Vacante {
    id_ofertas: number;
    titulo: string;
    fecha_publicacion: string;
}

// ----------------------------------------------
// AGRUPAR OFERTAS POR MES
// ----------------------------------------------
function agruparOfertasPorMes(vacantes: Vacante[]) {
    const contadorMeses: Record<string, number> = {};

    const mesesMap = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

    vacantes.forEach(v => {
        if (!v.fecha_publicacion) return;

        const fecha = new Date(v.fecha_publicacion);
        if (isNaN(fecha.getTime())) return;

        const mes = mesesMap[fecha.getMonth()];
        const año = fecha.getFullYear();

        const key = `${mes} ${año}`;
        contadorMeses[key] = (contadorMeses[key] || 0) + 1;
    });

    const mesesInv: Record<string, number> = {
        ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11
    };

    return Object.entries(contadorMeses)
        .map(([mes, total]) => {
            const [mesStr, año] = mes.split(" ");
            return {
                mes,
                total,
                sortValue: new Date(Number(año), mesesInv[mesStr], 1).getTime(),
            };
        })
        .sort((a, b) => a.sortValue - b.sortValue)
        .map(obj => ({ mes: obj.mes, total: obj.total }));
}

// ----------------------------------------------
// COMPONENTE
// ----------------------------------------------
export default function GraficaOfertasPorMes() {
    const [vacantes, setVacantes] = useState<Vacante[]>([]);

    useEffect(() => {
        async function fetchData() {
            const resp = await fetch("/api/Ofertas");
            const json = await resp.json();
            if (json.ok) setVacantes(json.vacantes);
        }
        fetchData();
    }, []);

    const dataCompleta = agruparOfertasPorMes(vacantes);
    function completarUltimos3Meses(data: { mes: string; total: number }[]) {
        const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        const hoy = new Date();

        const resultado: { mes: string; total: number }[] = [];

        for (let i = 2; i >= 0; i--) {
            const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
            const key = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;

            const existente = data.find(d => d.mes === key);

            resultado.push({
                mes: key,
                total: existente ? existente.total : 0,
            });
        }

        return resultado;
    }
    const data = completarUltimos3Meses(dataCompleta);
    const ultimoMes = data[data.length - 1];

    return (
        <div className="bg-white rounded-xl shadow-md w-full p-6 flex flex-col space-y-6">

            {/* TÍTULO */}
            <div className="flex items-center justify-between w-full">
                <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-4">
                    Historial de ofertas creadas
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
                            <linearGradient id="vacantesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>

                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            fill="url(#vacantesGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* RESUMEN DEL ÚLTIMO MES */}
            {ultimoMes && (
                <div className="mt-4">
                    <p className="text-sm text-gray-500">Último mes registrado:</p>
                    <h2 className="text-2xl font-bold text-orange-500 mt-1">
                        {ultimoMes.total} ofertas creadas
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Mes: {ultimoMes.mes.toUpperCase()}
                    </p>
                </div>
            )}
        </div>
    );
}

