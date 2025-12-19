"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEstadoPaso } from "@/hook/EstadoPaso";
import toast from "react-hot-toast";
import LoaderIndicador from "@/components/Loader";

export default function EventoPage() {
  const { id_solicitud } = useParams();
  const [form, setForm] = useState({
    ceremonia_realizara: false,
    ceremonia_fecha_hora: "",
    ceremonia_lugar: "",
    requerimientos_evento: "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const { estadoPaso, bloqueado } = useEstadoPaso(
    id_solicitud as string,
    "Eventos"
  );

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get(
          `/api/Convenios/Generales/${id_solicitud}/Eventos`
        );
        if (data) {
          setForm({
            ceremonia_realizara: !!data.ceremonia_realizara,
            ceremonia_fecha_hora: data.ceremonia_fecha_hora
              ? new Date(data.ceremonia_fecha_hora).toISOString().slice(0, 16)
              : "",
            ceremonia_lugar: data.ceremonia_lugar || "",
            requerimientos_evento: data.requerimientos_evento || "",
          });
        }
      } catch (err) {
        toast.error("No se pudieron cargar los datos del evento ❌");
        console.warn("No se pudo cargar el evento", err);
      } finally {
        setCargando(false);
      }
    };
    if (id_solicitud) cargar();
  }, [id_solicitud]);

  const guardar = async () => {
    const toastId = toast.loading("Guardando cambios...");
    setGuardando(true);
    try {
      await axios.put(`/api/Convenios/Generales/${id_solicitud}/Eventos`, form);
      toast.success("Evento guardado correctamente ", { id: toastId });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const mensaje =
          err.response?.data?.error || "Error al guardar el evento ";
        toast.error(mensaje, { id: toastId });
        console.error("❌ Axios error:", err);
      } else {
        toast.error("Error inesperado ", { id: toastId });
        console.error("❌ Error desconocido:", err);
      }
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <LoaderIndicador mensaje="Cargando datos de Eventos..." />;
  }


  const bloqueadoPaso =
    bloqueado || estadoPaso === "EN REVISION" || estadoPaso === "APROBADO";
  //console.log("paso actual: ", estadoPaso);
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-[#011848]">
        Datos del evento o ceremonia
      </h2>

      <div className="space-y-4 border p-4 rounded-xl bg-gray-50 text-black">
        {/* Checkbox */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.ceremonia_realizara}
            onChange={(e) =>
              setForm({ ...form, ceremonia_realizara: e.target.checked })
            }
            disabled={bloqueadoPaso}
          />
          <span>¿Se realizará ceremonia?</span>
        </label>

        {form.ceremonia_realizara && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha y hora de la ceremonia
              </label>
              <input
                type="datetime-local"
                className="w-full border rounded-lg p-2"
                value={form.ceremonia_fecha_hora}
                onChange={(e) =>
                  setForm({ ...form, ceremonia_fecha_hora: e.target.value })
                }
                disabled={bloqueadoPaso}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Lugar de la ceremonia
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={form.ceremonia_lugar}
                onChange={(e) =>
                  setForm({ ...form, ceremonia_lugar: e.target.value })
                }
                disabled={bloqueadoPaso}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Requerimientos especiales o logística
              </label>
              <textarea
                rows={3}
                className="w-full border rounded-lg p-2"
                value={form.requerimientos_evento}
                onChange={(e) =>
                  setForm({ ...form, requerimientos_evento: e.target.value })
                }
                disabled={bloqueadoPaso}
              />
            </div>
          </>
        )}
      </div>
      {!bloqueadoPaso && (
        <button
          onClick={guardar}
          disabled={guardando}
          className="bg-[#53b431] hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      )}
    </div>
  );
}
