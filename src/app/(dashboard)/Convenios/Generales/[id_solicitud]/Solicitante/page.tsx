"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useEstadoPaso } from "@/hook/EstadoPaso";
import { toast } from "react-hot-toast";
import LoaderIndicador from "@/components/Loader";

export default function PasoSolicitante() {
  const { id_solicitud } = useParams();
  const { estadoPaso, bloqueado } = useEstadoPaso(id_solicitud as string, "Solicitante");

  const [form, setForm] = useState({
    solicitante_nombre: "",
    solicitante_email: "",
    solicitante_telefono_movil: "",
    solicitante_telefono_oficina: "",
    solicitante_ext_oficina: "",
  });

  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get(`/api/Convenios/Generales/${id_solicitud}/Solicitante`);
        setForm({
          solicitante_nombre: data.solicitante_nombre ?? "",
          solicitante_email: data.solicitante_email ?? "",
          solicitante_telefono_movil: data.solicitante_telefono_movil ?? "",
          solicitante_telefono_oficina: data.solicitante_telefono_oficina ?? "",
          solicitante_ext_oficina: data.solicitante_ext_oficina ?? "",
        });
      } catch {
        console.warn("No se pudieron cargar los datos del solicitante");
      } finally {
        setCargando(false);
      }
    };
    if (id_solicitud) cargar();
  }, [id_solicitud]);

  const guardar = async () => {
    setGuardando(true);
    const toastId = toast.loading("Guardando cambios...");
    try {
      await axios.put(`/api/Convenios/Generales/${id_solicitud}/Solicitante`, form);
      toast.success("Datos guardados correctamente", { id: toastId });
    } catch {
      toast.error("Error al guardar los datos ❌", { id: toastId });
    } finally {
      setGuardando(false);
    }
  };

    if (cargando) {
      return <LoaderIndicador mensaje="Cargando datos del Solicitante..." />;
    }
  

  const bloqueadoPaso = bloqueado || estadoPaso === "EN REVISION" || estadoPaso === "APROBADO";

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-black">
      <h2 className="text-xl font-semibold text-[#011848]">Datos del Solicitante</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Nombre completo</label>
        <input
          type="text"
          className="w-full border rounded-lg p-2"
          value={form.solicitante_nombre}
          onChange={(e) => setForm({ ...form, solicitante_nombre: e.target.value })}
          disabled={bloqueadoPaso}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Correo electrónico</label>
        <input
          type="email"
          className="w-full border rounded-lg p-2"
          value={form.solicitante_email}
          onChange={(e) => setForm({ ...form, solicitante_email: e.target.value })}
          disabled={bloqueadoPaso}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono móvil</label>
          <input
            type="text"
            className="w-full border rounded-lg p-2"
            value={form.solicitante_telefono_movil}
            onChange={(e) => setForm({ ...form, solicitante_telefono_movil: e.target.value })}
            disabled={bloqueadoPaso}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Teléfono oficina</label>
          <input
            type="text"
            className="w-full border rounded-lg p-2"
            value={form.solicitante_telefono_oficina}
            onChange={(e) => setForm({ ...form, solicitante_telefono_oficina: e.target.value })}
            disabled={bloqueadoPaso}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Extensión</label>
          <input
            type="text"
            className="w-full border rounded-lg p-2"
            value={form.solicitante_ext_oficina}
            onChange={(e) => setForm({ ...form, solicitante_ext_oficina: e.target.value })}
            disabled={bloqueadoPaso}
          />
        </div>
      </div>

      {!bloqueadoPaso && (
        <button
          onClick={guardar}
          disabled={guardando}
          className="px-6 py-2 bg-[#53b431] text-white rounded-lg hover:bg-[#459b28] transition"
        >
          {guardando ? "Guardando..." : "Guardar y continuar"}
        </button>
      )}
    </div>
  );
}
