"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import ModalConfirmacion from "@/components/ModalConfirmacionAdmin";
import toast from "react-hot-toast";

interface Solicitud {
  id_solicitud: number;
  creador: { nombre: string; correo: string } | null;
  fecha_solicitud: string | null;
  reviewed_at: Date | null;
  revisor: { nombre: string; correo: string } | null;
  estado: { id_estado: number; nombre_estado: string };
}

export default function AdminSolicitudesEspecificos() {
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

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get("/api/Admin/Convenios/Especifico");
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

  if (cargando)
    return (
      <p className="text-center py-10 text-black">Cargando solicitudes...</p>
    );

  return (
    <div className="max-w-6xl mx-auto py-8 text-black">
      <h1 className="text-2xl font-bold text-[#011848] text-center mb-6">
        Panel de Convenios Especificos
      </h1>

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
            {solicitudes.map((s) => (
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
                      : "text-yellow-600"
                  }`}
                >
                  {s.estado.nombre_estado}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Link
                    href={`/Admin/Convenios/Especificos/${s.id_solicitud}/EstadoSolicitud`}
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
