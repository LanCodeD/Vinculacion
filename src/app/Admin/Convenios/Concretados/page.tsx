"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModalConfirmacion from "@/components/ModalConfirmacionAdmin";

interface ConvenioConcretado {
  id_convenio_concretado: number;
  id_solicitud: number;
  documento_ruta: string | null;
  fecha_firmada: string | null;
  vigencia: string | null;
  fecha_expira: string | null;
  created_at: string;
  updated_at: string;
  solicitud: {
    id_solicitud: number;
    titulo: string;
    creador: { nombre: string; correo: string };
    estado: { nombre_estado: string };
  };
}

export default function AdminConveniosConcretados() {
  const [convenios, setConvenios] = useState<ConvenioConcretado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalEliminar, setModalEliminar] = useState<{ abierto: boolean; id?: number }>({
    abierto: false,
  });

  // 🚀 Obtener convenios reales
  const obtenerConvenios = async () => {
    try {
      setCargando(true);
      const res = await fetch("/api/convenios-concretados");
      if (!res.ok) throw new Error("Error al cargar convenios");
      const data = await res.json();
      setConvenios(data);
    } catch (error) {
      toast.error("Error al cargar convenios concretados");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerConvenios();
  }, []);

  // Eliminar (por ahora simulado)
  const confirmarEliminar = async () => {
    toast("Aquí luego se implementa la eliminación real");
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
          onClick={() => toast("Abrir modal para crear convenio")}
          className="bg-[#53b431] hover:bg-[#469a29] text-white px-4 py-2 rounded-lg"
        >
          + Agregar Convenio
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-[#011848] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Título</th>
              <th className="px-4 py-2 text-left">Solicitante</th>
              <th className="px-4 py-2 text-left">Documento</th>
              <th className="px-4 py-2 text-left">Fecha Firmada</th>
              <th className="px-4 py-2 text-left">Vigencia</th>
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
                <td className="px-4 py-2">{c.solicitud.titulo}</td>
                <td className="px-4 py-2">
                  <p className="font-semibold">{c.solicitud.creador.nombre}</p>
                  <p className="text-xs text-gray-500">{c.solicitud.creador.correo}</p>
                </td>
                <td className="px-4 py-2">
                  {c.documento_ruta ? (
                    <a
                      href={c.documento_ruta}
                      target="_blank"
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
                    ? new Date(c.fecha_firmada).toLocaleDateString("es-MX")
                    : "—"}
                </td>
                <td className="px-4 py-2">{c.vigencia || "—"}</td>
                <td className="px-4 py-2">
                  {c.fecha_expira
                    ? new Date(c.fecha_expira).toLocaleDateString("es-MX")
                    : "—"}
                </td>
                <td className="px-4 py-2 font-semibold text-green-700">
                  {c.solicitud.estado.nombre_estado}
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
    </div>
  );
}
