"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { FaFilePdf } from "react-icons/fa";

// 🔹 Tipos
type ReporteSolicitudes = {
  total: number;
  porEstado: Record<string, number>;
  porTipo: Record<string, number>;
  porCreador: Record<string, number>;
  solicitudes: {
    id_solicitud: number;
    fecha_solicitud: string | null;
    creado_por_usuario_id: number;
    tipo_solicitud_id: number;
    estado_id: number;
    reviewed_by_user_id: number | null;
    reviewed_at: string | null;
    creador: {
      id_usuarios: number;
      nombre: string;
      apellido: string;
      correo: string;
    } | null;
    revisor: {
      id_usuarios: number;
      nombre: string;
      apellido: string;
      correo: string;
    } | null;
    tipo: { id_tipo: number; nombre_tipo: string } | null;
    estado: { id_estado: number; nombre_estado: string } | null;
  }[];
  rango: { inicio: string; fin: string };
};

export default function ReporteSolicitudesPage() {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [trimestre, setTrimestre] = useState<string | null>(null);
  const [reporte, setReporte] = useState<ReporteSolicitudes | null>(null);
  const [descargando, setDescargando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchReporte = async () => {
      setCargandoDatos(true);

      try {
        const params = new URLSearchParams();
        params.set("anio", String(anio));
        if (trimestre) params.set("trimestre", trimestre);

        const res = await axios.get(`/api/Admin/Convenios/Concretados/reportes/Solicitudes?${params}`);

        await new Promise((resolve) => setTimeout(resolve, 300));
        setReporte(res.data);
      } catch (error) {
        console.error("Error al obtener reporte:", error);
      } finally {
        setCargandoDatos(false);
      }
    };

    fetchReporte();
  }, [anio, trimestre]);

  return (
    <div className="max-w-6xl mx-auto py-10 text-black">
      <h1 className="text-3xl font-extrabold text-[#011848] mb-8 text-center">
        Reporte de Solicitudes de Convenios (No concluidas)
      </h1>

      {cargandoDatos && (
        <div className="flex items-center justify-center gap-3 mt-4 p-3 text-blue-900">
          <svg
            className="animate-spin h-6 w-6 text-blue-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="font-medium text-blue-700 animate-pulse">
            Cargando datos...
          </span>
        </div>
      )}

      {!cargandoDatos && (
        <>
          {/* 🔹 Filtros */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <select
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className="px-4 py-2 rounded-lg bg-blue-50 text-[#011848] border border-blue-200 shadow-sm focus:ring-2 focus:ring-[#011848]"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {["Q1", "Q2", "Q3", "Q4"].map((q) => (
              <button
                key={q}
                onClick={() => setTrimestre(q)}
                className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
                  trimestre === q
                    ? "bg-[#53b431] text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {q}
              </button>
            ))}

            <button
              onClick={() => setTrimestre(null)}
              className="px-4 py-2 rounded-lg bg-[#011848] text-white shadow hover:bg-[#022063] transition"
            >
              Anual
            </button>
          </div>

          {/* 🔹 Resumen */}
          {reporte && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-6 rounded-xl bg-[#011848] text-white shadow-lg">
                <h3 className="opacity-80">Total Solicitudes</h3>
                <p className="text-4xl font-bold">{reporte.total}</p>
              </div>

              {Object.entries(reporte.porEstado).map(([estado, count]) => (
                <div
                  key={estado}
                  className="p-6 rounded-xl bg-[#53b431] text-white shadow-lg"
                >
                  <h3 className="opacity-90 text-lg">{estado}</h3>
                  <p className="text-4xl font-bold">{count}</p>
                </div>
              ))}
            </div>
          )}

          {/* 🔹 Tabla */}
          {reporte?.solicitudes && (
            <div className="bg-white shadow-xl rounded-xl p-6">
              {reporte.solicitudes.length > 0 && (
                <div className="flex justify-end mb-4">
                  {/* Botón PDF */}
                  <button
                    onClick={async () => {
                      try {
                        setDescargando(true);
                        const res = await axios.post(
                          "/api/VinculacionReporte/Solicitudes_No",
                          { solicitudes: reporte.solicitudes },
                          { responseType: "blob" }
                        );
                        const url = URL.createObjectURL(res.data);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `ReporteSolicitudesNoFinalizadas-${anio}${
                          trimestre ?? "Anual"
                        }.pdf`;
                        link.click();
                        URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error("Error descargando PDF:", error);
                      } finally {
                        setDescargando(false);
                      }
                    }}
                    disabled={descargando}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition shadow-lg
                  ${
                    descargando
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-[#011848] hover:bg-[#022063]"
                  }`}
                  >
                    {!descargando ? (
                      <>
                        <FaFilePdf className="text-xl" />
                        Descargar PDF
                      </>
                    ) : (
                      <span className="animate-pulse">Generando...</span>
                    )}
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="bg-[#011848] text-white rounded-lg">
                    <tr>
                      <th className="px-4 py-3 text-left">Fecha Solicitud</th>
                      <th className="px-4 py-3 text-left">Creador</th>
                      <th className="px-4 py-3 text-left">Tipo</th>
                      <th className="px-4 py-3 text-left">Estado</th>
                      <th className="px-4 py-3 text-left">Revisor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.solicitudes.map((s) => (
                      <tr
                        key={s.id_solicitud}
                        className="border-b hover:bg-blue-50 transition"
                      >
                        <td className="px-4 py-2">
                          {s.fecha_solicitud
                            ? dayjs.utc(s.fecha_solicitud).format("DD/MM/YYYY")
                            : "—"}
                        </td>
                        <td className="px-4 py-2">
                          {s.creador
                            ? `${s.creador.nombre} ${s.creador.apellido}`
                            : "—"}
                        </td>
                        <td className="px-4 py-2">
                          {s.tipo?.nombre_tipo ?? "—"}
                        </td>
                        <td className="px-4 py-2">
                          {s.estado?.nombre_estado ?? "—"}
                        </td>
                        <td className="px-4 py-2">
                          {s.revisor
                            ? `${s.revisor.nombre} ${s.revisor.apellido}`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {reporte.solicitudes.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No hay datos para este período. Selecciona otro año o
                  trimestre.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
