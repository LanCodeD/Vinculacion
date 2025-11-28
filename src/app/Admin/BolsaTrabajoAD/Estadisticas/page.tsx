"use client"
import { useState } from "react";

// Única gráfica disponible por ahora
import GraficaOfertasPorMes from "@/components/Charts/GraficaOfertasPorMes";
import GraficaPostulantesPorOferta from "@/components/Charts/GraficaPostulantesPorOferta";

export default function Dashboard() {
    const [selectedChart, setSelectedChart] = useState("ofertasMes");

    const renderChart = () => {
        switch (selectedChart) {
            case "ofertasMes":
                return <GraficaOfertasPorMes />;
            default:
                return null;

            case "postulantesOferta":
                return <GraficaPostulantesPorOferta />;
        }
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Dashboard de Estadísticas</h1>

            {/* Contenedor tipo card */}
            <div className="p-4 border rounded-xl shadow-sm bg-white space-y-2">
                <p className="font-medium">Selecciona una gráfica</p>

                {/* Dropdown simple sin shadcn */}
                <select
                    value={selectedChart}
                    onChange={(e) => setSelectedChart(e.target.value)}
                    className="border p-2 rounded w-full bg-white"
                >
                    <option value="ofertasMes">Ofertas por Mes</option>
                    <option value="postulantesOferta">Postulantes por oferta</option>
                </select>
            </div>

            {/* Card de contenido */}
            <div className="p-4 border rounded-xl shadow-sm bg-white">
                {renderChart()}
            </div>
        </div>
    );
}