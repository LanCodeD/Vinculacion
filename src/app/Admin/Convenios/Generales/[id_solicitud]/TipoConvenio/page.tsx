"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import LoaderIndicador from "@/components/Loader";

interface FormTipoConvenio {
  firmas_origen: number[];
}

export default function TipoConvenioAdmin() {
  const { id_solicitud } = useParams();
  const [form, setForm] = useState<FormTipoConvenio | null>(null);
  const [firmas, setFirmas] = useState<{ id_firma: number; nombre: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        // 🔹 Cargar datos del convenio
        const { data } = await axios.get(
          `/api/Convenios/Generales/${id_solicitud}`
        );
        setForm(data);

        // 🔹 Cargar nombres de las firmas disponibles
        const firmasData = await axios.get("/api/Convenios/firma_origen");
        setFirmas(firmasData.data.slice(0, 2)); // solo las 2 válidas
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id_solicitud]);

  if (loading) {
    return <LoaderIndicador mensaje="Cargando datos del Tipo de Convenio..." />;
  }

  if (!form)
    return (
      <p className="text-center py-6 text-gray-600">
        No hay datos registrados.
      </p>
    );

  /*   // 🔹 Utilidad para formatear fechas a formato legible
  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return "—";

    // ✳️ Evitamos la conversión de zona horaria
    const soloFecha = fecha.split("T")[0]; // "2025-10-01"

    // Convertimos manualmente para mostrar con formato legible (sin perder el día)
    const [anio, mes, dia] = soloFecha.split("-").map(Number);

    // 🔹 Formato local en español sin alterar la fecha
    const formato = new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formato.format(new Date(anio, mes - 1, dia));
  }; */

  // 🔹 Obtener nombres de firmas seleccionadas
  const firmasSeleccionadas: string[] = (form.firmas_origen || [])
    .map((id: number) => firmas.find((f) => f.id_firma === id)?.nombre || "")
    .filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto text-black space-y-5">
      <h2 className="text-2xl font-semibold text-[#011848] mb-2">
        Tipo de Convenio
      </h2>

      {/* Descripción */}
      {/*       <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción de la Empresa
        </label>
        <p className="border rounded-lg p-3 bg-gray-50 whitespace-pre-wrap">
          {form.descripcion_empresa || "—"}
        </p>
      </div> */}

      {/* Fechas */}
      {/*       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de inicio del proyecto
          </label>
          <p className="border rounded-lg p-3 bg-gray-50">
            {formatearFecha(form.fecha_inicio_proyecto)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de conclusión del proyecto
          </label>
          <p className="border rounded-lg p-3 bg-gray-50">
            {formatearFecha(form.fecha_conclusion_proyecto)}
          </p>
        </div>
      </div> */}

      {/* Firmas */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Firmas de origen
        </label>
        {firmasSeleccionadas.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {firmasSeleccionadas.map((nombre, id) => (
              <span
                key={id}
                className="bg-[#53b431] text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm"
              >
                {nombre}
              </span>
            ))}
          </div>
        ) : (
          <p className="border rounded-lg p-3 bg-gray-50 mt-1">—</p>
        )}
      </div>
      <div className="text-sm text-gray-500 italic">
        *Esta información fue proporcionada por el solicitante.
      </div>
    </div>
  );
}
