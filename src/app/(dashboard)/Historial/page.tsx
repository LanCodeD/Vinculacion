"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { FaEye, FaSearch } from "react-icons/fa";
dayjs.extend(utc);

// 🎯 Interfaz extendida para mostrar más datos
interface SolicitudConvenio {
  id_solicitud: number;
  creado_por_usuario_id: number;
  tipo_solicitud_id: number;
  tipo?: { nombre_tipo: string };
  estado?: { nombre_estado: string };
  solicitud_firmas_origen?: { firma?: { nombre: string } }[];

  // Relación opcional con convenio concretado
  convenio_concretado?: {
    id_convenio_concretado: number;
    documento_ruta?: string | null;
    fecha_firmada?: string | null;
    vigencia?: string | null;
    unidad_vigencia?: string | null;
    fecha_expira?: string | null;
    estado_dinamico?: string;
  };

  // Para estilos visuales
  color_estado?: string;
}

export default function HistorialSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<SolicitudConvenio[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const conveniosPorPagina = 9;

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const { data } = await axios.get("/api/Convenios/Historial");
        setSolicitudes(data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const mensaje =
            err.response?.data?.error || "Error al cargar historial";
          toast.error(mensaje);
          console.error("❌ Axios error:", err);
        } else {
          toast.error("Error inesperado ❌");
          console.error("❌ Error desconocido:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  const irASolicitud = (id: number, tipoId: number) => {
    const tipo = tipoId === 1 ? "Generales" : "Especificos";
    router.push(`/Convenios/${tipo}/${id}/TipoConvenio`);
  };

  const conveniosFiltrados = solicitudes.filter((s) => {
    const texto = busqueda.toLowerCase();

    return (
      s.id_solicitud.toString().includes(texto) ||
      s.tipo?.nombre_tipo?.toLowerCase().includes(texto) ||
      s.estado?.nombre_estado?.toLowerCase().includes(texto) ||
      (s.solicitud_firmas_origen &&
        s.solicitud_firmas_origen.some((f) =>
          f.firma?.nombre?.toLowerCase().includes(texto)
        )) ||
      s.convenio_concretado?.estado_dinamico?.toLowerCase().includes(texto) ||
      s.convenio_concretado?.vigencia?.toLowerCase().includes(texto) ||
      s.convenio_concretado?.unidad_vigencia?.toLowerCase().includes(texto)
    );
  });

  const totalPaginas = Math.ceil(
    conveniosFiltrados.length / conveniosPorPagina
  );
  const indiceInicio = (paginaActual - 1) * conveniosPorPagina;
  const conveniosPaginados = conveniosFiltrados.slice(
    indiceInicio,
    indiceInicio + conveniosPorPagina
  );

  return (
    <div className="max-w-6xl mx-auto py-8 text-black">
      <h1 className="text-2xl font-bold text-[#011848] text-center mb-6">
        Historial de Solicitudes
      </h1>

      <div className="mb-6 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            placeholder="Buscar por Tipo, Firmas o Estado..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#011848] focus:border-[#011848] text-sm"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <FaSearch size={14} />
          </span>
        </div>
      </div>

      {loading ? (
        <p>Cargando solicitudes...</p>
      ) : solicitudes.length === 0 ? (
        <p>No tienes solicitudes registradas.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-[1000px] text-sm border-collapse">
            <thead className="bg-[#011848] text-white">
              <tr>
                <th className="px-4 py-2 text-left">ID Solicitud</th>
                <th className="px-4 py-2 text-left">Tipo de Solicitud</th>
                <th className="px-4 py-2 text-left">Firmas de Origen</th>
                <th className="px-4 py-2 text-left">Documento</th>
                <th className="px-4 py-2 text-left">Fecha Firmada</th>
                <th className="px-4 py-2 text-left">Vigencia</th>
                <th className="px-4 py-2 text-left">Unidad Vigencia</th>
                <th className="px-4 py-2 text-left">Fecha Expira</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {conveniosPaginados.map((s, i) => (
                <tr
                  key={`${s.id_solicitud}-${i}`}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 font-medium text-gray-800">
                    {s.id_solicitud}
                  </td>
                  <td className="px-4 py-2">
                    {s.tipo_solicitud_id === 1 ? "General" : "Específico"}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {Array.isArray(s.solicitud_firmas_origen) &&
                    s.solicitud_firmas_origen.length > 0
                      ? s.solicitud_firmas_origen
                          .map((f) => f.firma?.nombre ?? "—")
                          .join(", ")
                      : "Sin firmas"}
                  </td>
                  <td className="px-4 py-2">
                    {s.convenio_concretado?.documento_ruta ? (
                      <a
                        href={s.convenio_concretado.documento_ruta}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Ver documento
                      </a>
                    ) : (
                      "No disponible"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {s.convenio_concretado?.fecha_firmada
                      ? dayjs
                          .utc(s.convenio_concretado.fecha_firmada)
                          .format("DD/MM/YYYY")
                      : "Pendiente"}
                  </td>
                  <td className="px-4 py-2">
                    {s.convenio_concretado?.vigencia ?? "Pendiente"}
                  </td>
                  <td className="px-4 py-2">
                    {s.convenio_concretado?.unidad_vigencia ?? "Pendiente"}
                  </td>
                  <td className="px-4 py-2">
                    {s.convenio_concretado?.fecha_expira
                      ? dayjs
                          .utc(s.convenio_concretado.fecha_expira)
                          .format("DD/MM/YYYY")
                      : "Pendiente"}
                  </td>
                  <td className="px-4 py-2">
                    <div
                      className={`font-semibold ${
                        s.color_estado ?? "text-gray-500"
                      }`}
                    >
                      {s.estado?.nombre_estado ?? "—"}
                    </div>
                    <div className="text-xs text-gray-400">
                      (
                      {s.convenio_concretado?.estado_dinamico ?? "Sin convenio"}
                      )
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-3 h-full">
                      <button
                        onClick={() =>
                          irASolicitud(s.id_solicitud, s.tipo_solicitud_id)
                        }
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Ver solicitud"
                      >
                        <FaEye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="px-3 py-2 rounded-lg bg-[#011848] text-white hover:bg-[#022063] disabled:bg-gray-300 disabled:text-gray-500 transition"
        >
          ←
        </button>

        {[...Array(totalPaginas)].map((_, i) => {
          const page = i + 1;
          const activo = paginaActual === page;
          return (
            <button
              key={page}
              onClick={() => setPaginaActual(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                activo
                  ? "bg-[#53b431] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() =>
            setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
          }
          disabled={paginaActual === totalPaginas}
          className="px-3 py-2 rounded-lg bg-[#011848] text-white hover:bg-[#022063] disabled:bg-gray-300 disabled:text-gray-500 transition"
        >
          →
        </button>
      </div>
    </div>
  );
}
