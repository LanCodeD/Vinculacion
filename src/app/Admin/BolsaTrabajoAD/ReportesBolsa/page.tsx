// app/(tu-ruta)/ReporteOfertasPage.tsx  (o pages/... según estructura)
"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { FaFilePdf } from "react-icons/fa";
dayjs.extend(utc);

// ---------- TIPOS ----------
type Empresa = { nombre_comercial: string } | null;

type PostulacionSimple = {
  id_postulaciones: number;
};

type Oferta = {
  id_ofertas: number;
  titulo: string;
  empresas: Empresa;
  postulaciones: PostulacionSimple[];
  oferta_estados_id: 3 | 4 | 5;
  fecha_publicacion?: string | null;
};

type ReporteOfertasResponse = {
  total: number;
  porEstado: {
    publicadas: number;
    rechazadas: number;
    cerradas: number;
  };
  ofertas: Oferta[];
  rango?: { inicio: string; fin: string };
};

type PayloadReporte = {
  anio: number;
  trimestre?: string | null;
};

const estadoTexto: Record<3 | 4 | 5, string> = {
  3: "Publicada",
  4: "Rechazada",
  5: "Cerrada",
};

export default function ReporteOfertasPage() {
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [trimestre, setTrimestre] = useState<string | null>(null); 
  const [reporte, setReporte] = useState<ReporteOfertasResponse | null>(null);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [descargando, setDescargando] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchReporte();
  }, [anio, trimestre]);

  async function fetchReporte() {
    setCargandoDatos(true);
    try {
      const payload: PayloadReporte = { anio };
      if (trimestre) payload.trimestre = trimestre;
      const res = await axios.post<ReporteOfertasResponse>(
        "/api/Admin/BolsaTrabajo/Reportes/Ofertas",
        payload
      );

      await new Promise((r) => setTimeout(r, 200));
      setReporte(res.data);
    } catch (error) {
      console.error("Error al obtener reporte de ofertas:", error);
      setReporte(null);
    } finally {
      setCargandoDatos(false);
    }
  }

  async function handleDescargarPdf() {
    if (!reporte) return;
    setDescargando(true);

    try {
      const res = await axios.post(
        "/api/Admin/BolsaTrabajo/Reportes/ReporteOfertas",
        { ofertas: reporte.ofertas },
        { responseType: "blob" }
      );

      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      const fileName = `ReporteOfertas-${anio}-${trimestre ?? "Anual"}.pdf`;
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
      {/* Título */}
      <h1 className="text-3xl font-extrabold text-[#011848] mb-6 text-center">
        Reporte de Ofertas
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

      {/* Contenido cuando no carga */}
      {!cargandoDatos && (
        <>
          {/* FILTROS */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <select
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className="px-4 py-2 rounded-lg bg-blue-50 text-[#011848] border border-blue-200 shadow-sm focus:ring-2 focus:ring-[#011848]"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
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

          {/* RESUMEN TARJETAS */}
          {reporte && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-xl bg-[#011848] text-white shadow-lg">
                <h3 className="opacity-80">Total Ofertas</h3>
                <p className="text-4xl font-bold">{reporte.total}</p>
                {/* Mostrar rango si existe */}
                {reporte.rango && (
                  <p className="text-xs mt-2 opacity-80">
                    {dayjs.utc(reporte.rango.inicio).format("DD/MM/YYYY")} -{" "}
                    {dayjs.utc(reporte.rango.fin).format("DD/MM/YYYY")}
                  </p>
                )}
              </div>

              <div className="p-6 rounded-xl bg-green-500 text-white shadow-lg">
                <h3 className="opacity-90 text-lg">Publicadas</h3>
                <p className="text-4xl font-bold">{reporte.porEstado.publicadas}</p>
              </div>

              <div className="p-6 rounded-xl bg-red-500 text-white shadow-lg">
                <h3 className="opacity-90 text-lg">Rechazadas</h3>
                <p className="text-4xl font-bold">{reporte.porEstado.rechazadas}</p>
              </div>

              <div className="p-6 rounded-xl bg-gray-200 text-black shadow-lg md:col-span-3">
                <h3 className="opacity-80">Cerradas</h3>
                <p className="text-2xl font-bold">{reporte.porEstado.cerradas}</p>
              </div>
            </div>
          )}

          {/* TABLA */}
          <div className="bg-white shadow-xl rounded-xl p-6">
            {/* Botón PDF */}
            {reporte && reporte.ofertas.length > 0 && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleDescargarPdf}
                  disabled={descargando}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition shadow-lg
                    ${descargando
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
                    <th className="px-4 py-3 text-left">Título</th>
                    <th className="px-4 py-3 text-left">Empresa</th>
                    <th className="px-4 py-3 text-left">Fecha Publicación</th>
                    <th className="px-4 py-3 text-left">Postulantes</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {reporte?.ofertas.map((o) => (
                    <tr key={o.id_ofertas} className="border-b hover:bg-blue-50 transition">
                      <td className="px-4 py-2">{o.titulo}</td>

                      <td className="px-4 py-2">
                        {o.empresas?.nombre_comercial ?? "Sin empresa"}
                      </td>

                      <td className="px-4 py-2">
                        {o.fecha_publicacion
                          ? dayjs.utc(o.fecha_publicacion).format("DD/MM/YYYY")
                          : "—"}
                      </td>

                      <td className="px-4 py-2">{o.postulaciones?.length ?? 0}</td>

                      <td className="px-4 py-2">{estadoTexto[o.oferta_estados_id]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {reporte?.ofertas.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No hay datos para este período. Selecciona otro año o trimestre.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
