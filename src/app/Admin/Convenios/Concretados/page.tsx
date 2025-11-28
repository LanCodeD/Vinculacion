"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModalConfirmacion from "@/components/ModalConfirmacionAdmin";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import ModalConvenioConcretado from "@/components/ModalConvenioConcretado";
import ModalEditarConvenioConcretado from "@/components/ModalConvenioConcretadoEditar";
import ModalVerConvenioConcretado from "@/components/ModalConvenioConcretadoVer";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

type EstadoConvenio = "ACTIVO" | "PRÓXIMO A VENCER" | "VENCIDO" | "SIN FECHA";

interface ConvenioConcretado {
  id_convenio_concretado: number;
  id_solicitud: number;
  documento_ruta: string | null;
  fecha_firmada: string | null;
  vigencia: string | null;
  unidad_vigencia: string | null;
  fecha_expira: string | null;
  created_at: string;
  updated_at: string;
  estado_dinamico: EstadoConvenio; // 👈 tipado fuerte, sin usar string suelto
  color_estado: string;
  eficiencia: number;
  meta: {
    id_metas_convenios: number;
    nombre: string;
  };
  solicitud: {
    id_solicitud: number;
    tipo?: { nombre_tipo: string };
    creador?: { nombre: string; correo: string };
    estado?: { nombre_estado: string };
    solicitud_firmas_origen?: { firma?: { nombre: string } }[];
    detalle: {
      alcance: string;
      dependencia_nombre: string;
      dependencia_responsable_nombre: string;
      descripcion_empresa: string;
      fecha_conclusion_proyecto: string;
      fecha_inicio_proyecto: string;
      dependencia_domicilio_legal: string;
    };
  };
}

export default function AdminConveniosConcretados() {
  const [convenios, setConvenios] = useState<ConvenioConcretado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalEliminar, setModalEliminar] = useState<{
    abierto: boolean;
    id?: number;
  }>({ abierto: false });
  const [modalCrear, setModalCrear] = useState(false);
  const [creando, setCreando] = useState(false);
  const [solicitudesFinalizadas, setSolicitudesFinalizadas] = useState([]);
  const [Metas, setMetas] = useState([]);
  const [modalEditar, setModalEditar] = useState<{
    abierto: boolean;
    convenio?: ConvenioConcretado;
  }>({ abierto: false });
  const [modalVer, setModalVer] = useState<{
    abierto: boolean;
    convenio?: ConvenioConcretado;
  }>({ abierto: false });
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const conveniosPorPagina = 10;

  const obtenerConvenios = async () => {
    try {
      setCargando(true);
      const { data } = await axios.get("/api/Admin/Convenios/Concretados");
      setConvenios(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar convenios concretados");
    } finally {
      setCargando(false);
    }
  };

  const cargar = async () => {
    try {
      const { data } = await axios.get(
        "/api/Admin/Convenios/Concretados/ConvenioFinalizado"
      );
      setSolicitudesFinalizadas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const metasCarga = async () => {
    try {
      const { data } = await axios.get(
        "/api/Admin/Convenios/Concretados/Metas"
      );
      setMetas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerConvenios();
    cargar();
    metasCarga();
  }, []);

  const confirmarEliminar = async () => {
    if (!modalEliminar.id) return;
    try {
      await axios.delete(
        `/api/Admin/Convenios/Concretados/${modalEliminar.id}`
      );
      toast.success(
        "Convenio eliminado correctamente y solicitud regresada a finalizada"
      );
      await obtenerConvenios(); // recarga
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar convenio");
    } finally {
      setModalEliminar({ abierto: false });
    }
  };

  const crearConvenio = async (formData: FormData) => {
    try {
      setCreando(true);
      await axios.post("/api/Admin/Convenios/Concretados", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Convenio creado correctamente 🎉");
      await obtenerConvenios(); // ✅ recarga completa en lugar de insertar manualmente
      setModalCrear(false);
    } catch (error) {
      toast.error("Error al crear convenio");
      console.error(error);
    } finally {
      setCreando(false);
    }
  };

  const actualizarConvenio = async (formData: FormData) => {
    try {
      setCreando(true);
      await axios.put("/api/Admin/Convenios/Concretados", formData);
      toast.success("Convenio actualizado correctamente 🎉");
      await obtenerConvenios();
      setModalEditar({ abierto: false });
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar convenio");
    } finally {
      setCreando(false);
    }
  };

  const conveniosFiltrados = convenios.filter((c) => {
    const texto = busqueda.toLowerCase();
    return (
      c.solicitud?.creador?.nombre?.toLowerCase().includes(texto) ||
      c.solicitud?.creador?.correo?.toLowerCase().includes(texto) ||
      c.solicitud?.tipo?.nombre_tipo?.toLowerCase().includes(texto) ||
      c.meta?.nombre?.toLowerCase().includes(texto)
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

  if (cargando)
    return (
      <p className="text-center py-10 text-black">
        Cargando convenios concretados...
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto py-8 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#011848]">
          Panel de Convenios Concretados
        </h1>
        <button
          onClick={() => setModalCrear(true)}
          className="bg-[#53b431] hover:bg-[#469a29] text-white px-4 py-2 rounded-lg"
        >
          + Agregar Convenio
        </button>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            placeholder="Buscar por solicitante, tipo o meta..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#011848] focus:border-[#011848] text-sm"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <FaSearch size={14} />
          </span>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-[#011848] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Tipo de Solicitud</th>
              <th className="px-4 py-2 text-left">Firmas de Origen</th>
              <th className="px-4 py-2 text-left">Solicitante</th>
              <th className="px-4 py-2 text-left">Documento</th>
              <th className="px-4 py-2 text-left">Fecha Firmada</th>
              <th className="px-4 py-2 text-left">Vigencia</th>
              <th className="px-4 py-2 text-left">Unidad Vigencia</th>
              <th className="px-4 py-2 text-left">Fecha Expira</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Acción</th>
            </tr>
          </thead>

          <tbody>
            {conveniosPaginados.map((c) => (
              <tr
                key={c.id_convenio_concretado}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2 font-medium text-gray-800">
                  {c.solicitud?.tipo?.nombre_tipo ?? "—"}
                </td>

                <td className="px-4 py-2 text-gray-700">
                  {Array.isArray(c.solicitud?.solicitud_firmas_origen) &&
                  c.solicitud.solicitud_firmas_origen.length > 0
                    ? c.solicitud.solicitud_firmas_origen
                        .map((f) => f.firma?.nombre ?? "—")
                        .join(", ")
                    : "Sin firmas"}
                </td>

                <td className="px-4 py-2">
                  <p className="font-semibold">
                    {c.solicitud?.creador?.nombre ?? "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {c.solicitud?.creador?.correo ?? "—"}
                  </p>
                </td>

                <td className="px-4 py-2">
                  {c.documento_ruta ? (
                    <a
                      href={c.documento_ruta}
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
                  {c.fecha_firmada
                    ? dayjs.utc(c.fecha_firmada).format("DD/MM/YYYY")
                    : "—"}
                </td>

                <td className="px-4 py-2">{c.vigencia ?? "—"}</td>
                <td className="px-4 py-2">{c.unidad_vigencia ?? "—"}</td>

                <td className="px-4 py-2">
                  {c.fecha_expira
                    ? dayjs.utc(c.fecha_expira).format("DD/MM/YYYY")
                    : "—"}
                </td>

                <td className="px-4 py-2">
                  <div
                    className={`font-semibold ${
                      c.color_estado ?? "text-gray-500"
                    }`}
                  >
                    {c.estado_dinamico ?? "—"}
                  </div>
                  <div className="text-xs text-gray-400">
                    ({c.solicitud?.estado?.nombre_estado ?? "—"})
                  </div>
                </td>

                <td className="px-4 py-2">
                  <div className="flex items-center justify-center gap-3 h-full">
                    <button
                      onClick={() =>
                        setModalVer({ abierto: true, convenio: c })
                      }
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Ver"
                    >
                      <FaEye size={18} />
                    </button>

                    <button
                      onClick={() =>
                        setModalEditar({ abierto: true, convenio: c })
                      }
                      className="text-yellow-600 hover:text-yellow-800 transition"
                      title="Editar"
                    >
                      <FaEdit size={18} />
                    </button>

                    <button
                      onClick={() =>
                        setModalEliminar({
                          abierto: true,
                          id: c.id_convenio_concretado,
                        })
                      }
                      className="text-red-600 hover:text-red-800 transition"
                      title="Eliminar"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

      <ModalConfirmacion
        abierto={modalEliminar.abierto}
        titulo="Eliminar convenio concretado"
        mensaje="¿Estás seguro de eliminar este convenio concretado? Esta acción no se puede deshacer."
        tipo="eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setModalEliminar({ abierto: false })}
        confirmando={false}
      />

      <ModalConvenioConcretado
        abierto={modalCrear}
        onCerrar={() => setModalCrear(false)}
        onCrear={crearConvenio}
        cargando={creando}
        solicitudesFinalizadas={solicitudesFinalizadas}
        metasConvenios={Metas}
      />

      <ModalEditarConvenioConcretado
        abierto={modalEditar.abierto}
        onCerrar={() => setModalEditar({ abierto: false })}
        convenio={modalEditar.convenio ?? null}
        metasConvenios={Metas}
        onActualizar={actualizarConvenio}
        cargando={creando}
      />

      <ModalVerConvenioConcretado
        abierto={modalVer.abierto}
        onCerrar={() => setModalVer({ abierto: false })}
        convenio={modalVer.convenio ?? null}
      />
    </div>
  );
}
