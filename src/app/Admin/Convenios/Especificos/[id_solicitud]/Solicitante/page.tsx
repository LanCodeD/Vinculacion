"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PasoSolicitanteEspecificoAdmin() {
  const { id_solicitud } = useParams();

  const [form, setForm] = useState({
    solicitante_nombre: "",
    solicitante_email: "",
    solicitante_telefono_movil: "",
    solicitante_telefono_oficina: "",
    solicitante_ext_oficina: "",
    contacto_nombre: "",
    contacto_email: "",
    contacto_telefono_movil: "",
    contacto_telefono_oficina: "",
    contacto_ext_oficina: "",
  });

  const [cargando, setCargando] = useState(true);

  // 🔹 Cargar datos del solicitante y contacto
  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get(
          `/api/Convenios/Especificos/${id_solicitud}/Solicitante`
        );
        setForm({
          solicitante_nombre: data.solicitante_nombre ?? "",
          solicitante_email: data.solicitante_email ?? "",
          solicitante_telefono_movil: data.solicitante_telefono_movil ?? "",
          solicitante_telefono_oficina: data.solicitante_telefono_oficina ?? "",
          solicitante_ext_oficina: data.solicitante_ext_oficina ?? "",
          contacto_nombre: data.contacto_nombre ?? "",
          contacto_email: data.contacto_email ?? "",
          contacto_telefono_movil: data.contacto_telefono_movil ?? "",
          contacto_telefono_oficina: data.contacto_telefono_oficina ?? "",
          contacto_ext_oficina: data.contacto_ext_oficina ?? "",
        });
      } catch (error) {
        console.error("❌ Error al cargar datos del solicitante:", error);
      } finally {
        setCargando(false);
      }
    };

    if (id_solicitud) cargar();
  }, [id_solicitud]);

  if (cargando)
    return <p className="text-center py-6 text-black">Cargando datos...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-black">
      <h2 className="text-2xl font-semibold text-[#011848]">
        Datos del Solicitante
      </h2>

      {/* 🔹 Sección del solicitante */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre completo (Docente solicitante)
          </label>
          <p className="border rounded-lg p-3 bg-gray-50 mt-1">
            {form.solicitante_nombre || "—"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <p className="border rounded-lg p-3 bg-gray-50 mt-1">
            {form.solicitante_email || "—"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono móvil
            </label>
            <p className="border rounded-lg p-3 bg-gray-50 mt-1">
              {form.solicitante_telefono_movil || "—"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono oficina
            </label>
            <p className="border rounded-lg p-3 bg-gray-50 mt-1">
              {form.solicitante_telefono_oficina || "—"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Extensión
            </label>
            <p className="border rounded-lg p-3 bg-gray-50 mt-1">
              {form.solicitante_ext_oficina || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 Sección del contacto */}
      <div className="pt-6 border-t space-y-4">
        <h3 className="text-lg font-semibold text-[#011848]">
          Datos del Contacto en la Empresa
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <p className="border rounded-lg p-3 bg-gray-50 mt-1">
            {form.contacto_nombre || "—"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <p className="border rounded-lg p-3 bg-gray-50 mt-1">
            {form.contacto_email || "—"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono móvil
            </label>
            <p className="border rounded-lg p-3 bg-gray-50 mt-1">
              {form.contacto_telefono_movil || "—"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono oficina
            </label>
            <p className="border rounded-lg p-3 bg-gray-50 mt-1">
              {form.contacto_telefono_oficina || "—"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Extensión
            </label>
            <p className="border rounded-lg p-3 bg-gray-50 mt-1">
              {form.contacto_ext_oficina || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 Mensaje final */}
      <div className="text-sm text-gray-500 italic border-t pt-4">
        *Esta información fue proporcionada por el solicitante.
      </div>
    </div>
  );
}
