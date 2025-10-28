"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModalConfirmacion from "@/components/ModalConfirmacionAdmin";
import axios from "axios";
import ModalConvenioConcretado from "@/components/ModalConvenioConcretado";
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
  solicitud: {
    id_solicitud: number;
    tipo?: { nombre_tipo: string };
    creador?: { nombre: string; correo: string };
    estado?: { nombre_estado: string };
    solicitud_firmas_origen?: { firma?: { nombre: string } }[];
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

  useEffect(() => {
    obtenerConvenios();
    cargar();
  }, []);

  const confirmarEliminar = async () => {
    toast("Aquí luego se implementa la eliminación real");
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
            </tr>
          </thead>

          <tbody>
            {convenios.map((c) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalConfirmacion
        abierto={modalEliminar.abierto}
        titulo="Eliminar convenio concretado"
        mensaje="¿Estás seguro de eliminar este convenio? Esta acción no se puede deshacer."
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
      />
    </div>
  );
}
