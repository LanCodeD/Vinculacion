"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import LoaderIndicador from "@/components/Loader";

interface EmpresaData {
  dependencia_nombre: string; // Nombre de la empresa
  descripcion_empresa: string;
  dependencia_responsable_nombre: string; // Representante legal
  dependencia_rfc: string; // RFC
  dependencia_domicilio_legal: string; // Domicilio legal
}

export default function AdminDatosEmpresa() {
  const { id_solicitud } = useParams();
  const [form, setForm] = useState<EmpresaData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        // Reutilizamos el mismo endpoint del solicitante
        const { data } = await axios.get(
          `/api/Convenios/Generales/${id_solicitud}/DatosEmpresa`
        );
        setForm(data);
      } catch (error) {
        console.error("❌ Error al cargar los datos de la empresa:", error);
      } finally {
        setCargando(false);
      }
    };

    if (id_solicitud) cargar();
  }, [id_solicitud]);

  // 🕓 Estado de carga
  if (cargando) {
    return <LoaderIndicador mensaje="Cargando datos de la Empresa.." />;
  }

  // 🚫 Sin datos
  if (!form)
    return (
      <p className="text-center py-10 text-gray-500 italic">
        No se encontraron datos de la empresa.
      </p>
    );

  // ✅ Render
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-black">
      <h2 className="text-xl font-semibold text-[#011848]">
        Datos de la Empresa
      </h2>

      <div className="border rounded-lg bg-white shadow p-5 space-y-3">
        <p>
          <strong>Nombre de la empresa:</strong>{" "}
          <span className="text-gray-700">
            {form.dependencia_nombre || "—"}
          </span>
        </p>

        <div>
          <label className="block text-sm font-bold text-black">
            Descripción de la Empresa:
          </label>
          <p className="border rounded-lg p-3 bg-gray-50 whitespace-pre-wrap">
            {form.descripcion_empresa || "—"}
          </p>
        </div>

        <p>
          <strong>Representante legal:</strong>{" "}
          <span className="text-gray-700">
            {form.dependencia_responsable_nombre || "—"}
          </span>
        </p>

        <p>
          <strong>RFC:</strong>{" "}
          <span className="text-gray-700">{form.dependencia_rfc || "—"}</span>
        </p>

        <div>
          <strong>Domicilio legal:</strong>
          <p className="border rounded-lg bg-gray-50 p-3 mt-1 text-gray-700 whitespace-pre-line">
            {form.dependencia_domicilio_legal || "—"}
          </p>
        </div>
      </div>

      <div className="text-sm text-gray-500 italic">
        *Esta información fue proporcionada por el solicitante.
      </div>
    </div>
  );
}
