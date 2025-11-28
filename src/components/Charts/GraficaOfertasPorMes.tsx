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

// ----------------------------------------------------------
// AGRUPAR OFERTAS POR MES + ORDEN REAL
// ----------------------------------------------------------
function agruparOfertasPorMes(vacantes: Vacante[]) {
    const contadorMeses: Record<string, number> = {};

    const mesesMap: Record<number, string> = {
        0: "ene", 1: "feb", 2: "mar", 3: "abr", 4: "may", 5: "jun",
        6: "jul", 7: "ago", 8: "sep", 9: "oct", 10: "nov", 11: "dic",
    };

    vacantes.forEach(v => {
        if (!v.fecha_publicacion) return;

        const fecha = new Date(v.fecha_publicacion);
        if (isNaN(fecha.getTime())) return;

        const mes = mesesMap[fecha.getMonth()];
        const año = fecha.getFullYear();

        const label = `${mes} ${año}`;

        contadorMeses[label] = (contadorMeses[label] || 0) + 1;
    });

    const mesesInv = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };

    return Object.entries(contadorMeses)
        .map(([mesAño, total]) => {
            const [mesStr, año] = mesAño.split(" ");

            return {
                mes: mesAño,
                total,
                sortValue: new Date(Number(año), mesesInv[mesStr as keyof typeof mesesInv], 1).getTime(),
            };
        })
        .sort((a, b) => a.sortValue - b.sortValue)
        .map(({ mes, total }) => ({ mes, total }));
}

// ----------------------------------------------------------
// COMPONENTE ESTILIZADO TIPO "Diagnosis History"
// ----------------------------------------------------------
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

    const data = agruparOfertasPorMes(vacantes);
    const ultimoMes = data[data.length - 1];

    return (
        <div className="flex flex-col items-start mt-6 bg-white p-6 rounded-xl shadow-md w-full">

            {/* IZQUIERDA: GRÁFICA */}
            <div className="w-full">
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-[#072635] text-[18px] font-bold">
                        Historial de ofertas creadas
                    </h2>

                    <button className="flex items-center justify-between w-[140px]">
                        <span className="text-[14px] text-[#072635] font-light">
                            Últimos meses
                        </span>
                        <span>▼</span>
                    </button>
                </div>

                <div className="mt-4 w-full h-[260px]">
                    <ResponsiveContainer>
                        <AreaChart data={data} margin={{ left: 0, right: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

                            <XAxis dataKey="mes" tickLine={false} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />

                            <Tooltip
                                contentStyle={{
                                    background: "white",
                                    borderRadius: "8px",
                                    padding: "8px",
                                    border: "1px solid #e5e7eb"
                                }}
                                labelStyle={{ fontWeight: "bold" }}
                            />

                            <defs>
                                <linearGradient id="vacantesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#5FC3D6" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#5FC3D6" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>

                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#5FC3D6"
                                strokeWidth={3}
                                fill="url(#vacantesGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* DERECHA: ESTADÍSTICA RESUMEN */}
            {ultimoMes && (
                <div className="w-full lg:w-1/3 flex flex-col items-start justify-center mt-6 lg:mt-0 lg:ml-10">
                    <div className="flex flex-col w-full">

                        {/* Punto de color */}
                        <div className="flex items-center">
                            <span className="w-4 h-4 rounded-full bg-[#5FC3D6] border border-white"></span>
                            <span className="text-[#072635] ml-2 text-[14px] font-normal">
                                Último mes registrado
                            </span>
                        </div>

                        <h2 className="text-[#072635] text-[26px] font-bold mt-3">
                            {ultimoMes.total} ofertas
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                            Mes: {ultimoMes.mes.toUpperCase()}
                        </p>

                        <hr className="w-full h-[1px] mt-4 bg-[#CBC8D4]" />

                        <div className="mt-4 text-[#072635] text-[15px] font-light">
                            Comparación con meses anteriores no implementada aún
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
