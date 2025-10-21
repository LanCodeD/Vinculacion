"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Clock, CircleDashed } from "lucide-react"; // 🔹 Agregamos ícono para pendiente

interface RegistroAuditoria {
  paso: string;
  estado: string;
  comentario: string;
}

export default function AuditoriaConvenio() {
  const { id_solicitud } = useParams();

  const [historial, setHistorial] = useState<RegistroAuditoria[]>([]);
  const [bloqueado, setBloqueado] = useState(false);

  // 🔹 Cargar los datos desde el backend
  const cargar = async () => {
    try {
      const { data } = await axios.get(
        `/api/Convenios/Generales/${id_solicitud}/Auditoria`
      );
      setHistorial(data.historial);
      setBloqueado(data.bloqueado);
    } catch (err) {
      toast.error("Error al cargar la auditoría ❌");
      console.error("Error al cargar auditoría:", err);
    }
  };

  useEffect(() => {
    if (id_solicitud) cargar();
  }, [id_solicitud]);

  // 🔹 Enviar la solicitud a revisión
  const enviarSolicitud = async () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm text-gray-800">
            ¿Enviar solicitud para revisión?
          </p>
          <p className="text-xs text-gray-600">
            No podrás editar los datos una vez enviada. Verifica que todo esté completo.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const toastId = toast.loading("Enviando solicitud...");
                try {
                  await axios.put(`/api/Convenios/Generales/${id_solicitud}/Enviar`);
                  toast.success("Solicitud enviada correctamente ✅", { id: toastId,
                    duration: 3000
                   });
                  await cargar();
                } catch {
                  toast.error("Error al enviar la solicitud ❌", { id: toastId });
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-md"
            >
              Enviar
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 hover:bg-gray-400 text-xs px-3 py-1 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  // 🔹 Calcular un estado general (arriba de la tabla)
  const estadoGeneral =
    historial.length === 0
      ? "Sin información aún"
      : historial.every((h) => h.estado === "APROBADO")
      ? "✅ Aprobado totalmente"
      : historial.some((h) => h.estado === "CORREGIR")
      ? "❌ Con observaciones"
      : historial.some((h) => h.estado === "PENDIENTE")
      ? "🕓 Pendiente de revisión"
      : "🔄 En revisión";

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 text-black">
      <h2 className="text-2xl font-bold text-[#011848] text-center">
        Estado de la Solicitud
      </h2>

      {/* 🔹 Estado general */}
      <div
        className={`text-center font-semibold py-2 rounded-lg ${
          estadoGeneral.includes("Aprobado")
            ? "bg-green-100 text-green-700"
            : estadoGeneral.includes("observaciones")
            ? "bg-red-100 text-red-700"
            : estadoGeneral.includes("Pendiente")
            ? "bg-blue-100 text-blue-700"
            : estadoGeneral.includes("revisión")
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {estadoGeneral}
      </div>

      {/* 🔹 Tabla */}
      <div className="border rounded-lg overflow-hidden shadow-sm mt-4">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#011848] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Paso</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Comentario</th>
            </tr>
          </thead>
          <tbody>
            {historial.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500 italic">
                  Aún no hay información del progreso de esta solicitud.
                </td>
              </tr>
            ) : (
              historial.map((h, i) => (
                <tr
                  key={i}
                  className={`border-b transition-all hover:bg-gray-50 ${
                    h.estado === "APROBADO"
                      ? "bg-green-50"
                      : h.estado === "CORREGIR"
                      ? "bg-orange-50"
                      : h.estado === "PENDIENTE"
                      ? "bg-blue-50"
                      : "bg-yellow-50"
                  }`}
                >
                  {/* Paso */}
                  <td className="px-4 py-2 font-medium">{h.paso}</td>

                  {/* Estado + ícono */}
                  <td className="px-4 py-2 font-semibold flex items-center gap-2">
                    {h.estado === "APROBADO" && (
                      <CheckCircle className="text-green-600 w-5 h-5" />
                    )}
                    {h.estado === "CORREGIR" && (
                      <XCircle className="text-orange-600 w-5 h-5" />
                    )}
                    {h.estado === "EN REVISION" && (
                      <Clock className="text-yellow-600 w-5 h-5" />
                    )}
                    {h.estado === "PENDIENTE" && (
                      <CircleDashed className="text-blue-600 w-5 h-5" />
                    )}
                    <span
                      className={
                        h.estado === "APROBADO"
                          ? "text-green-600"
                          : h.estado === "CORREGIR"
                          ? "text-orange-600"
                          : h.estado === "PENDIENTE"
                          ? "text-blue-700"
                          : "text-yellow-700"
                      }
                    >
                      {h.estado}
                    </span>
                  </td>

                  {/* Comentario */}
                  <td className="px-4 py-2 text-gray-700">
                    {h.comentario || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Botón de envío o mensaje bloqueado */}
      {!bloqueado && (
        <button
          onClick={enviarSolicitud}
          className="w-full py-2 bg-[#53b431] text-white font-semibold rounded-lg hover:bg-[#439728] transition-colors"
        >
          Enviar solicitud a administrador
        </button>
      )}

      {bloqueado && (
        <div className="text-center text-gray-500 italic">
          La solicitud fue enviada. Ya no puedes editar los datos.
        </div>
      )}
    </div>
  );
}
