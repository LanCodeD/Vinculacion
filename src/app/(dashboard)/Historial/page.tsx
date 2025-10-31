"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

// 🎯 Interfaz local para tipar las solicitudes
interface SolicitudConvenio {
  id_solicitud: number;
  creado_por_usuario_id: number;
  tipo_solicitud_id: number;
}

export default function HistorialSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<SolicitudConvenio[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const { data } = await axios.get("/api/Convenios/Historial");
        setSolicitudes(data);
      } catch (err: unknown) {
        const mensaje =
          (err as any)?.response?.data?.error || "Error al cargar historial";
        toast.error(mensaje);
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-black">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-[#011848] mb-6">
        Historial de Solicitudes
      </h1>

      {loading ? (
        <p>Cargando solicitudes...</p>
      ) : solicitudes.length === 0 ? (
        <p>No tienes solicitudes registradas.</p>
      ) : (
        <table className="w-full border rounded-md overflow-hidden text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">ID Solicitud</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s, i) => (
              <tr key={s.id_solicitud} className="border-t">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{s.id_solicitud}</td>
                <td className="px-4 py-2">
                  {s.tipo_solicitud_id === 1 ? "General" : "Específico"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => irASolicitud(s.id_solicitud, s.tipo_solicitud_id)}
                    className="text-blue-600 hover:underline"
                  >
                    Ir a solicitud
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
