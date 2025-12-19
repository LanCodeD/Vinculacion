"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import ModalConfirmacion from "@/components/ModalConfirmacionAdmin";
import { FaSearch } from "react-icons/fa";
import LoaderIndicador from "@/components/Loader";

interface Solicitud {
  id_solicitud: number;
  creador: { nombre: string; correo: string } | null;
  fecha_solicitud: string | null;
  reviewed_at: Date | null;
  revisor: { nombre: string; correo: string } | null;
  estado: { id_estado: number; nombre_estado: string };
}

export default function AdminSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalFinalizar, setModalFinalizar] = useState<{
    abierto: boolean;
    id?: number;
  }>({ abierto: false });
  const [confirmando, setConfirmando] = useState(false);
  const [modalEliminar, setModalEliminar] = useState<{
    abierto: boolean;
    id?: number;
  }>({ abierto: false });
  const [eliminando, setEliminando] = useState(false);

  const abrirModalFinalizar = (id: number) => {
    setModalFinalizar({ abierto: true, id });
  };

  const cerrarModal = () => {
    setModalFinalizar({ abierto: false, id: undefined });
  };

  const abrirModalEliminar = (id: number) => {
    setModalEliminar({ abierto: true, id });
  };

  const cerrarModalEliminar = () => {
    setModalEliminar({ abierto: false, id: undefined });
  };
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const solicitudesPorPagina = 10;

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get("/api/Admin/Convenios");
        setSolicitudes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const confirmarEliminar = async () => {
    if (!modalEliminar.id) return;
    setEliminando(true);

    try {
      await axios.delete(`/api/Admin/Convenios/${modalEliminar.id}`);
      setSolicitudes((prev) =>
        prev.filter((s) => s.id_solicitud !== modalEliminar.id)
      );

      toast.success("Solicitud eliminada correctamente ✅");
      cerrarModalEliminar();
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar ❌");
    } finally {
      setEliminando(false);
    }
  };

  const confirmarFinalizar = async () => {
    if (!modalFinalizar.id) return;
    setConfirmando(true);
    try {
      await axios.put(`/api/Admin/Convenios/${modalFinalizar.id}`);
      toast.success("Solicitud finalizada correctamente 🟢");
      window.location.reload();
    } catch {
      toast.error("Error al finalizar ❌");
    } finally {
      setConfirmando(false);
      cerrarModal();
    }
  };

  const solicitudesFiltradas = solicitudes.filter((s) => {
    const texto = busqueda.toLowerCase();
    return (
      s.creador?.nombre?.toLowerCase().includes(texto) ||
      s.creador?.correo?.toLowerCase().includes(texto) ||
      s.revisor?.nombre?.toLowerCase().includes(texto) ||
      s.estado?.nombre_estado?.toLowerCase().includes(texto)
    );
  });

  const totalPaginas = Math.ceil(
    solicitudesFiltradas.length / solicitudesPorPagina
  );
  const indiceInicio = (paginaActual - 1) * solicitudesPorPagina;
  const solicitudesPaginadas = solicitudesFiltradas.slice(
    indiceInicio,
    indiceInicio + solicitudesPorPagina
  );

  if (cargando) {
    return <LoaderIndicador mensaje="Cargando Solicitudes Convenios..." />;
  }


  return (
    <div className="max-w-6xl mx-auto py-8 text-black">
      <h1 className="text-2xl font-bold text-[#011848] text-center mb-6">
        Panel de Convenios Generales
      </h1>
      <div className="mb-6 flex items-center justify-center ">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            placeholder="Buscar por creador, revisor o estado..."
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
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Solicitante</th>
              <th className="px-4 py-2 text-left">Fecha Creada</th>
              <th className="px-4 py-2 text-left">Fecha Finalizada</th>
              <th className="px-4 py-2 text-left">Finalizada Por</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudesPaginadas.map((s) => (
              <tr
                key={s.id_solicitud}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2 font-medium">{s.id_solicitud}</td>
                <td className="px-4 py-2">
                  <div>
                    <p className="font-semibold">{s.creador?.nombre}</p>
                    <p className="text-xs text-gray-500">{s.creador?.correo}</p>
                  </div>
                </td>
                <td className="px-4 py-2">
                  {s.fecha_solicitud
                    ? new Date(
                        new Date(s.fecha_solicitud).getTime() +
                          new Date().getTimezoneOffset() * 60000
                      ).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "Sin registrar"}
                </td>

                <td className="px-4 py-2">
                  {s.reviewed_at
                    ? new Date(s.reviewed_at).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "Sin finalizar"}
                </td>
                <td className="px-4 py-2">
                  <div>
                    <p className="font-semibold">
                      {s.revisor?.nombre || "Sin Registrar"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {s.revisor?.correo || "Sin Registrar"}
                    </p>
                  </div>
                </td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    s.estado.nombre_estado === "APROBADO"
                      ? "text-green-600"
                      : s.estado.nombre_estado === "FINALIZADA"
                      ? "text-cyan-600"
                      : s.estado.nombre_estado === "CONVENIO CONCRETADO"
                      ? "text-teal-600"
                      : "text-yellow-600"
                  }`}
                >
                  {s.estado.nombre_estado}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Link
                    href={`/Admin/Convenios/Generales/${s.id_solicitud}/EstadoSolicitud`}
                    className="bg-[#53b431] text-white px-3 py-1 rounded hover:bg-[#46952c]"
                  >
                    Revisar
                  </Link>

                  {s.estado.nombre_estado === "APROBADO" && (
                    <button
                      onClick={() => abrirModalFinalizar(s.id_solicitud)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Finalizar
                    </button>
                  )}

                  <button
                    onClick={() => abrirModalEliminar(s.id_solicitud)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="px-4 py-2 rounded-lg bg-[#011848] text-white hover:bg-[#022063] disabled:bg-gray-300 disabled:text-gray-500 transition"
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
          className="px-4 py-2 rounded-lg bg-[#011848] text-white hover:bg-[#022063] disabled:bg-gray-300 disabled:text-gray-500 transition"
        >
          →
        </button>
      </div>

      <ModalConfirmacion
        abierto={modalFinalizar.abierto}
        titulo="Confirmar finalización"
        mensaje="Una vez finalizada la solicitud, ya no podrás modificar los estados ni hacer cambios."
        tipo="confirmar"
        onConfirmar={confirmarFinalizar}
        onCancelar={cerrarModal}
        confirmando={confirmando}
      />

      <ModalConfirmacion
        abierto={modalEliminar.abierto}
        titulo="Eliminar solicitud"
        mensaje="¿Estás seguro de eliminar esta solicitud? Esta acción no se puede deshacer."
        tipo="eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={cerrarModalEliminar}
        confirmando={eliminando}
      />
    </div>
  );
}
