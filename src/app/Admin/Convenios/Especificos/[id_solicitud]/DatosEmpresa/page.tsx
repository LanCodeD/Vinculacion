"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import LoaderIndicador from "@/components/Loader";

export default function PasoDatosEmpresaEspecificoAdmin() {
  const { id_solicitud } = useParams();

  const [form, setForm] = useState({
    dependencia_nombre: "",
    descripcion_empresa: "",
    dependencia_responsable_nombre: "",
    dependencia_rfc: "",
    dependencia_domicilio_legal: "",
  });

  const [cargando, setCargando] = useState(true);

  // 🔹 Cargar datos de la empresa
  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get(
          `/api/Convenios/Especificos/${id_solicitud}/DatosEmpresa`
        );
        setForm({
          dependencia_nombre: data.dependencia_nombre ?? "",
          descripcion_empresa: data.descripcion_empresa ?? "",
          dependencia_responsable_nombre:
            data.dependencia_responsable_nombre ?? "",
          dependencia_rfc: data.dependencia_rfc ?? "",
          dependencia_domicilio_legal: data.dependencia_domicilio_legal ?? "",
        });
      } catch (error) {
        console.error("❌ Error al cargar datos de empresa:", error);
      } finally {
        setCargando(false);
      }
    };

    if (id_solicitud) cargar();
  }, [id_solicitud]);

  if (cargando) {
    return <LoaderIndicador mensaje="Cargando datos de la Empresa..." />;
  }


  return (
    <div className="max-w-3xl mx-auto space-y-6 text-black">
      <h2 className="text-2xl font-semibold text-[#011848]">
        Datos de la Empresa o Dependencia
      </h2>

      {/* Nombre de la empresa */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre de la empresa o dependencia
        </label>
        <p className="border rounded-lg p-3 bg-gray-50 mt-1">
          {form.dependencia_nombre || "—"}
        </p>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción / Giro de la empresa
        </label>
        <p className="border rounded-lg p-3 bg-gray-50 mt-1 whitespace-pre-line">
          {form.descripcion_empresa || "—"}
        </p>
      </div>

      {/* Responsable */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre del responsable o representante
        </label>
        <p className="border rounded-lg p-3 bg-gray-50 mt-1">
          {form.dependencia_responsable_nombre || "—"}
        </p>
      </div>

      {/* RFC y domicilio */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            RFC
          </label>
          <p className="border rounded-lg p-3 bg-gray-50 mt-1">
            {form.dependencia_rfc || "—"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Domicilio legal
          </label>
          <p className="border rounded-lg p-3 bg-gray-50 mt-1">
            {form.dependencia_domicilio_legal || "—"}
          </p>
        </div>
      </div>

      {/* Mensaje final */}
      <div className="text-sm text-gray-500 italic border-t pt-4">
        *Esta información fue proporcionada por el solicitante.
      </div>
    </div>
  );
}
