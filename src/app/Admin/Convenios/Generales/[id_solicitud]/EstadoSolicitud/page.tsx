"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

interface PasoHistorial {
  paso: string;
  estado_id: number;
  comentario: string | null;
}

export default function EstadoSolicitudAdmin() {
  const { id_solicitud } = useParams();
  const [solicitud, setSolicitud] = useState<any>(null);
  const [historial, setHistorial] = useState<PasoHistorial[]>([]);
  const [comentario, setComentario] = useState("");
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  // 🔹 Cargar solicitud y pasos
  const cargar = async () => {
    try {
      const { data } = await axios.get(`/api/Admin/Convenios/${id_solicitud}`);
      setSolicitud(data.solicitud);
      setHistorial(data.historial);
    } catch (err) {
      console.error("Error al cargar solicitud:", err);
      toast.error("Error al cargar los datos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (id_solicitud) cargar();
  }, [id_solicitud]);

  // 🔹 Actualizar paso (Aprobar / Rechazar)
  const actualizarPaso = async (paso: string, estado_id: number) => {
    const toastId = toast.loading("Actualizando estado...");
    setActualizando(true);

    try {
      await axios.put(`/api/Admin/Convenios/${id_solicitud}/Paso`, {
        paso,
        estado_id,
        comentario,
      });
      toast.success(
        estado_id === 3
          ? `Paso "${paso}" aprobado ✅`
          : `Paso "${paso}" rechazado ❌`,
        { id: toastId }
      );
      setComentario("");
      await cargar(); // 🔁 Refresca datos sin recargar página
    } catch {
      toast.error("Error al actualizar el paso ❌", { id: toastId });
    } finally {
      setActualizando(false);
    }
  };

  if (cargando)
    return (
      <p className="text-center py-8 text-gray-700">Cargando solicitud...</p>
    );

  // 🔹 Nombres actualizados de los pasos
  const pasos = ["TipoConvenio", "DatosEmpresa", "Solicitante", "Eventos"];

  const estados = ["", "PENDIENTE", "EN_REVISIÓN", "APROBADO", "CORREGIR"];
  const bloqueado = solicitud?.estado?.nombre_estado === "FINALIZADA";

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6 text-black">
      <h1 className="text-2xl font-bold text-[#011848] text-center mb-6">
        Revisión de Solicitud # {id_solicitud}
      </h1>

      {/* 🧾 Información general */}
      <div className="border p-4 rounded-lg bg-white shadow space-y-1">
        <p>
          <strong>Solicitante:</strong> {solicitud?.creador?.nombre || "—"}
        </p>
        <p>
          <strong>Correo:</strong> {solicitud?.creador?.correo || "—"}
        </p>
        <p>
          <strong>Estado global:</strong>{" "}
          <span className="font-medium">
            {solicitud?.estado?.nombre_estado || "Desconocido"}
          </span>
        </p>
      </div>

      {/* 🧩 Tabla de pasos */}
      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#011848] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Paso</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Comentario</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pasos.map((p, i) => {
              const reg = historial.find((h) => h.paso === p);
              const estado_id = reg?.estado_id ?? 1; // default EN_REVISIÓN
              const estadoTexto = estados[estado_id];

              const color =
                estado_id === 3
                  ? "text-green-700 bg-green-50" // ✅ Aprobado
                  : estado_id === 4
                  ? "text-orange-700 bg-orange-50" // CORREGIR (antes RECHAZADO)
                  : estado_id === 1
                  ? "text-blue-700 bg-blue-50" // 🕓 Pendiente
                  : estado_id === 2
                  ? "text-yellow-700 bg-yellow-50" // 🔄 En revisión
                  : "text-gray-700 bg-gray-50";

              return (
                <tr key={i} className={`border-b ${color}`}>
                  <td className="px-4 py-2 font-medium">{p}</td>
                  <td className="px-4 py-2">{estadoTexto}</td>
                  <td className="px-4 py-2">
                    {reg?.comentario || (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => actualizarPaso(p, 3)}
                      disabled={bloqueado || actualizando}
                      className={`bg-green-600 text-white px-3 py-1 rounded ${
                        bloqueado
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-green-700"
                      }`}
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => actualizarPaso(p, 4)}
                      disabled={bloqueado || actualizando}
                      className={`bg-orange-500 text-white px-3 py-1 rounded ${
                        bloqueado
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-orange-600"
                      }`}
                    >
                      Corregir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 💬 Comentario general */}
      <div className="border p-4 rounded-lg bg-gray-50 mt-6">
        <label className="block text-sm font-medium mb-1">
          Comentario (opcional)
        </label>
        <textarea
          rows={3}
          className="w-full border rounded-lg p-2"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe un comentario sobre tu decisión..."
        />
      </div>
    </div>
  );
}
