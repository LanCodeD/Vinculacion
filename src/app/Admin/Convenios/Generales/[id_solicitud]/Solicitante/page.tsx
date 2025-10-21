"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface SolicitanteData {
  solicitante_nombre: string;
  solicitante_email: string;
  solicitante_telefono_movil: string;
  solicitante_telefono_oficina: string;
  solicitante_ext_oficina: string;
}

export default function AdminSolicitante() {
  const { id_solicitud } = useParams();
  const [form, setForm] = useState<SolicitanteData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        // 👇 Reutilizamos el mismo endpoint del solicitante
        const { data } = await axios.get(
          `/api/Convenios/Generales/${id_solicitud}/Solicitante`
        );
        setForm(data);
      } catch (error) {
        console.error("❌ Error al cargar los datos del solicitante:", error);
      } finally {
        setCargando(false);
      }
    };
    if (id_solicitud) cargar();
  }, [id_solicitud]);

  // 🕓 Estado de carga
  if (cargando)
    return (
      <p className="text-center py-10 text-black">Cargando datos...</p>
    );

  // 🚫 Sin datos
  if (!form)
    return (
      <p className="text-center py-10 text-gray-500 italic">
        No se encontraron datos del solicitante.
      </p>
    );

  // ✅ Render solo lectura
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-black">
      <h2 className="text-xl font-semibold text-[#011848]">
        Datos del Solicitante
      </h2>

      <div className="border rounded-lg bg-white shadow p-5 space-y-3">
        <p>
          <strong>Nombre completo:</strong>{" "}
          <span className="text-gray-700">{form.solicitante_nombre || "—"}</span>
        </p>

        <p>
          <strong>Correo electrónico:</strong>{" "}
          <span className="text-gray-700">{form.solicitante_email || "—"}</span>
        </p>

        <div className="grid grid-cols-3 gap-4">
          <p>
            <strong>Teléfono móvil:</strong>{" "}
            <span className="text-gray-700">
              {form.solicitante_telefono_movil || "—"}
            </span>
          </p>
          <p>
            <strong>Teléfono oficina:</strong>{" "}
            <span className="text-gray-700">
              {form.solicitante_telefono_oficina || "—"}
            </span>
          </p>
          <p>
            <strong>Extensión:</strong>{" "}
            <span className="text-gray-700">
              {form.solicitante_ext_oficina || "—"}
            </span>
          </p>
        </div>
      </div>

      <div className="text-sm text-gray-500 italic">
        *Esta información fue proporcionada por el solicitante.
      </div>
    </div>
  );
}
