"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { FaFilePdf } from "react-icons/fa";

type ReportePostulaciones = {
  total: number;
  porEstado: {
    pendientes: number;
    aceptados: number;
    rechazados: number;
  };
  postulaciones: {
    id_postulaciones: number;
    revisado_en: string;
    postulacion_estados_id: number;
    estado: { nombre_estado: string };
    usuario: { nombre: string; apellido: string };
    oferta: {
      titulo: string;
      empresas: { nombre_comercial: string };
    };
    mensaje: string | null;
  }[];
  rango: { inicio: string; fin: string };
};

export default function ReportePostulacionesPage() {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [trimestre, setTrimestre] = useState<string | null>(null);
  const [reporte, setReporte] = useState<ReportePostulaciones | null>(null);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [descargando, setDescargando] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchReporte = async () => {
      setCargandoDatos(true);

      try {
        const res = await axios.post("/api/Admin/BolsaTrabajo/Reportes/Postulaciones", {
          anio,
          trimestre,
        });

        await new Promise((r) => setTimeout(r, 300)); // animación natural

        setReporte(res.data);
      } catch (error) {
        console.error("Error al obtener reporte:", error);
      } finally {
        setCargandoDatos(false);
      }
    };

    fetchReporte();
  }, [anio, trimestre]);

  async function handleDescargarPdf() {
    if (!reporte) return;
    setDescargando(true);

    try {
      const res = await axios.post(
        "/api/Admin/BolsaTrabajo/Reportes/ReporteOfertas/ReportePostulaciones",
        { reporte }, // enviamos todo el reporte
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fileName = `ReportePostulaciones-${anio}-${trimestre ?? "Anual"}.pdf`;
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando PDF:", error);
    } finally {
      setDescargando(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-10 text-black">
      {/* TÍTULO */}
      <h1 className="text-3xl font-extrabold text-[#011848] mb-8 text-center">
        Reporte de Postulaciones
      </h1>

      {/* ANIMACIÓN DE CARGA */}
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
          {/* FILTROS */}
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
                className={`px-4 py-2 rounded-lg font-semibold shadow transition ${trimestre === q
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

          {/* TARJETAS DE RESUMEN */}
          {reporte && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="p-6 rounded-xl bg-[#011848] text-white shadow-lg">
                <h3 className="opacity-80">Total Postulaciones</h3>
                <p className="text-4xl font-bold">{reporte.total}</p>
              </div>

              <div className="p-6 rounded-xl bg-blue-600 text-white shadow-lg">
                <h3 className="opacity-80">Pendientes</h3>
                <p className="text-4xl font-bold">
                  {reporte.porEstado.pendientes}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#53b431] text-white shadow-lg">
                <h3 className="opacity-80">Aceptados</h3>
                <p className="text-4xl font-bold">
                  {reporte.porEstado.aceptados}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-red-500 text-white shadow-lg">
                <h3 className="opacity-80">Rechazados</h3>
                <p className="text-4xl font-bold">
                  {reporte.porEstado.rechazados}
                </p>
              </div>
            </div>
          )}

          {/* TABLA */}
          {reporte?.postulaciones && (
            <div className="bg-white shadow-xl rounded-xl p-6">
              {/* Botón PDF */}
              {reporte.postulaciones.length > 0 && (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleDescargarPdf}
                    disabled={descargando}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-[#011848] hover:bg-[#022063] transition shadow-lg"
                  >
                    <FaFilePdf className="text-xl" />
                    Descargar PDF
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="bg-[#011848] text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Empresa</th>
                      <th className="px-4 py-3 text-left">Vacante</th>
                      <th className="px-4 py-3 text-left">Egresado</th>
                      <th className="px-4 py-3 text-left">Estado</th>
                      <th className="px-4 py-3 text-left">Fecha de revision</th>
                      <th className="px-4 py-3 text-left">Mensaje rechazo</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reporte.postulaciones.map((p) => (
                      <tr
                        key={p.id_postulaciones}
                        className="border-b hover:bg-blue-50 transition"
                      >
                        <td className="px-4 py-2">
                          {p.oferta.empresas?.nombre_comercial}
                        </td>

                        <td className="px-4 py-2">{p.oferta.titulo}</td>

                        <td className="px-4 py-2">
                          {p.usuario.nombre} {p.usuario.apellido}
                        </td>

                        <td className="px-4 py-2">{p.estado.nombre_estado}</td>

                        <td className="px-4 py-2">
                          {p.revisado_en ? dayjs.utc(p.revisado_en).format("DD/MM/YYYY") : "Sin revisar"}
                        </td>

                        <td className="px-4 py-2 text-red-600 italic">
                          {p.mensaje ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {reporte.postulaciones.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No hay datos para este período.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
