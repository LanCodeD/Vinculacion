"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

interface Firma {
  id_firma: number;
  nombre: string;
}

export default function PasoTipoConvenioEspecificoAdmin() {
  const { id_solicitud } = useParams();

  const [form, setForm] = useState({
    nombre_proyecto: "",
    alcance_proyecto: "",
    fecha_inicio_proyecto: "",
    fecha_conclusion_proyecto: "",
    firmas_origen: [] as number[],
  });

  const [firmas, setFirmas] = useState<Firma[]>([]);
  const [cargando, setCargando] = useState(true);

  // 🔹 Cargar firmas disponibles (solo para mostrar sus nombres)
  useEffect(() => {
    const cargarFirmas = async () => {
      try {
        const { data } = await axios.get("/api/Convenios/Especificos/firmas_especificos");
        setFirmas(data);
      } catch (err) {
        console.error("❌ Error al cargar firmas:", err);
      }
    };
    cargarFirmas();
  }, []);

  // 🔹 Cargar datos del formulario llenado por el usuario
  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get(`/api/Convenios/Especificos/${id_solicitud}`);

        const toInputDate = (value?: string | null) => {
          if (!value) return "";
          return value.split("T")[0];
        };

        setForm({
          nombre_proyecto: data.nombre_proyecto ?? "",
          alcance_proyecto: data.alcance ?? "",
          fecha_inicio_proyecto: toInputDate(data.fecha_inicio_proyecto),
          fecha_conclusion_proyecto: toInputDate(data.fecha_conclusion_proyecto),
          firmas_origen: data.firmas_origen ?? [],
        });
      } catch (err) {
        console.error("❌ Error al cargar datos del tipo de convenio:", err);
      } finally {
        setCargando(false);
      }
    };
    if (id_solicitud) cargar();
  }, [id_solicitud]);

  if (cargando) return <p className="text-center py-6">Cargando datos...</p>;

  // 🔹 Obtener nombres de las firmas seleccionadas
  const firmasSeleccionadas = firmas
    .filter((f) => form.firmas_origen.includes(f.id_firma))
    .map((f) => f.nombre);

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-black">
      <h2 className="text-2xl font-semibold text-[#011848]">
        Tipo de Convenio Específico
      </h2>

      {/* Nombre del Proyecto */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre del Proyecto
        </label>
        <p className="border rounded-lg p-3 bg-gray-50 mt-1">
          {form.nombre_proyecto || "—"}
        </p>
      </div>

      {/* Alcance del Proyecto */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Alcance del Proyecto
        </label>
        <p className="border rounded-lg p-3 bg-gray-50 mt-1 whitespace-pre-line">
          {form.alcance_proyecto || "—"}
        </p>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de inicio del proyecto
          </label>
          <p className="border rounded-lg p-3 bg-gray-50 mt-1">
            {form.fecha_inicio_proyecto || "—"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de conclusión del proyecto
          </label>
          <p className="border rounded-lg p-3 bg-gray-50 mt-1">
            {form.fecha_conclusion_proyecto || "—"}
          </p>
        </div>
      </div>

      {/* Firmas */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Firmas de origen
        </label>
        {firmasSeleccionadas.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {firmasSeleccionadas.map((nombre, index) => (
              <span
                key={index}
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
    </div>
  );
}
