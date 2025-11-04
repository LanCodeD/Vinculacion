"use client";

import { useParams } from "next/navigation";
import { useEstadoPaso } from "@/hook/EstadoPasoEspecifico";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Firma {
  id_firma: number;
  nombre: string;
}

export default function PasoTipoConvenioEspecifico() {
  const { id_solicitud } = useParams();
  const { estadoPaso, bloqueado } = useEstadoPaso(
    id_solicitud as string,
    "TipoConvenio"
  );

  // 🔹 Estado inicial del formulario
  const [form, setForm] = useState({
    nombre_proyecto: "",
    alcance_proyecto: "",
    fecha_inicio_proyecto: "",
    fecha_conclusion_proyecto: "",
    firmas_origen: [] as number[],
  });

  const [firmas, setFirmas] = useState<Firma[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  // 🔹 Cargar firmas disponibles
  useEffect(() => {
    const cargarFirmas = async () => {
      const { data } = await axios.get(
        "/api/Convenios/Especificos/firmas_especificos"
      );
      // Solo mostrar las 2 primeras
      setFirmas(data);
    };
    cargarFirmas();
  }, []);

  // 🔹 Cargar datos previos del formulario
  useEffect(() => {
    const cargar = async () => {
      const { data } = await axios.get(
        `/api/Convenios/Especificos/${id_solicitud}`
      );

      // ✅ Evitar desfase de fecha (sin zona horaria)
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

      setCargando(false);
    };
    if (id_solicitud) cargar();
  }, [id_solicitud]);

  // 🔹 Guardar cambios
  const guardar = async () => {
    const toastId = toast.loading("Guardando cambios...");
    setGuardando(true);

    try {
      await axios.put(`/api/Convenios/Especificos/${id_solicitud}`, form);
      toast.success("Guardado correctamente ✅", { id: toastId });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const mensaje = err.response?.data?.error || "Error al guardar ❌";
        toast.error(mensaje, { id: toastId });
        console.error("❌ Axios error:", err);
      } else {
        toast.error("Error inesperado ❌", { id: toastId });
        console.error("❌ Error desconocido:", err);
      }
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p className="text-center py-6">Cargando datos...</p>;

  const bloqueadoPaso =
    bloqueado || estadoPaso === "EN REVISION" || estadoPaso === "APROBADO";

  // 🔹 Manejo del checkbox múltiple
  const toggleFirma = (id: number) => {
    if (form.firmas_origen.includes(id)) {
      setForm({
        ...form,
        firmas_origen: form.firmas_origen.filter((fid) => fid !== id),
      });
    } else {
      setForm({ ...form, firmas_origen: [...form.firmas_origen, id] });
    }
  };

  // ==========================================================
  // 🔹 RETURN
  // ==========================================================
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-black">
      <h2 className="text-xl font-semibold text-[#011848]">
        Tipo de Convenio Específico
      </h2>

      {/* Nombre del Proyecto */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre del Proyecto
        </label>
        <input
          type="text"
          className="w-full border rounded-lg p-2"
          value={form.nombre_proyecto}
          onChange={(e) =>
            setForm({ ...form, nombre_proyecto: e.target.value })
          }
          disabled={bloqueadoPaso}
        />
      </div>

      {/* Alcance del Proyecto */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Alcance del Proyecto
        </label>
        <textarea
          className="w-full border rounded-lg p-2"
          rows={2}
          value={form.alcance_proyecto}
          onChange={(e) =>
            setForm({ ...form, alcance_proyecto: e.target.value })
          }
          disabled={bloqueadoPaso}
        />
      </div>

      {/* Firmas múltiples */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Firmas de origen
        </label>
        <div className="space-y-2">
          {firmas.map((firma) => (
            <label key={firma.id_firma} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.firmas_origen.includes(firma.id_firma)}
                onChange={() => toggleFirma(firma.id_firma)}
                disabled={bloqueadoPaso}
              />
              <span>{firma.nombre}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha de inicio del proyecto
          </label>
          <input
            type="date"
            className="w-full border rounded-lg p-2"
            value={form.fecha_inicio_proyecto}
            onChange={(e) =>
              setForm({ ...form, fecha_inicio_proyecto: e.target.value })
            }
            disabled={bloqueadoPaso}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha de conclusión del proyecto
          </label>
          <input
            type="date"
            className="w-full border rounded-lg p-2"
            value={form.fecha_conclusion_proyecto}
            onChange={(e) =>
              setForm({ ...form, fecha_conclusion_proyecto: e.target.value })
            }
            disabled={bloqueadoPaso}
          />
        </div>
      </div>

      {!bloqueadoPaso && (
        <button
          onClick={guardar}
          disabled={guardando}
          className="bg-[#53b431] text-white px-4 py-2 rounded-lg hover:bg-[#46952c] w-full font-semibold shadow-sm"
        >
          {guardando ? "Guardando..." : "Guardar y continuar"}
        </button>
      )}
    </div>
  );
}
