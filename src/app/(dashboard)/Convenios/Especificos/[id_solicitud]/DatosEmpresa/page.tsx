"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useEstadoPaso } from "@/hook/EstadoPasoEspecifico";
import toast from "react-hot-toast";
import LoaderIndicador from "@/components/Loader";

export default function PasoDatosEmpresaEspecifico() {
  const { id_solicitud } = useParams();
  const { estadoPaso, bloqueado } = useEstadoPaso(
    id_solicitud as string,
    "DatosEmpresa"
  );

  const [form, setForm] = useState({
    dependencia_nombre: "",
    descripcion_empresa: "",
    dependencia_responsable_nombre: "",
    dependencia_rfc: "",
    dependencia_domicilio_legal: "",
  });

  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  //  Cargar datos existentes
  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get(
          `/api/Convenios/Especificos/${id_solicitud}/DatosEmpresa`
        );
        setForm({
          dependencia_nombre: data.dependencia_nombre ?? "",
          descripcion_empresa: data.descripcion_empresa ?? "",
          dependencia_responsable_nombre: data.dependencia_responsable_nombre ?? "",
          dependencia_rfc: data.dependencia_rfc ?? "",
          dependencia_domicilio_legal: data.dependencia_domicilio_legal ?? "",
        });
      } catch {
        console.log("No se pudieron cargar los datos de la empresa");
      } finally {
        setCargando(false);
      }
    };
    if (id_solicitud) cargar();
  }, [id_solicitud]);

  //  Guardar datos
  const guardar = async () => {
    setGuardando(true);
    const toastId = toast.loading("Guardando datos...");
    try {
      await axios.put(
        `/api/Convenios/Especificos/${id_solicitud}/DatosEmpresa`,
        form
      );
      toast.success("Datos guardados correctamente", { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar los datos ", { id: toastId });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <LoaderIndicador mensaje="Cargando datos de Empresas..." />;
  }


  const bloqueadoPaso =
    bloqueado || estadoPaso === "EN REVISION" || estadoPaso === "APROBADO";
  //console.log("paso actual: ",estadoPaso)

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-black">
      <h2 className="text-xl font-semibold text-[#011848]">
        Datos de la empresa
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre de la empresa
        </label>
        <input
          type="text"
          className="w-full border rounded-lg p-2"
          value={form.dependencia_nombre}
          onChange={(e) =>
            setForm({ ...form, dependencia_nombre: e.target.value })
          }
          disabled={bloqueadoPaso}
        />
      </div>

      {/* Descripción de la Empresa */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Descripción de la Empresa
        </label>
        <textarea
          className="w-full border rounded-lg p-2"
          rows={3}
          value={form.descripcion_empresa}
          onChange={(e) =>
            setForm({ ...form, descripcion_empresa: e.target.value })
          }
          disabled={bloqueadoPaso}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Representante legal
        </label>
        <input
          type="text"
          className="w-full border rounded-lg p-2"
          value={form.dependencia_responsable_nombre}
          onChange={(e) =>
            setForm({ ...form, dependencia_responsable_nombre: e.target.value })
          }
          disabled={bloqueadoPaso}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          RFC de la empresa
        </label>
        <input
          type="text"
          className="w-full border rounded-lg p-2"
          value={form.dependencia_rfc}
          onChange={(e) =>
            setForm({ ...form, dependencia_rfc: e.target.value })
          }
          disabled={bloqueadoPaso}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Domicilio legal
        </label>
        <textarea
          className="w-full border rounded-lg p-2"
          rows={2}
          value={form.dependencia_domicilio_legal}
          onChange={(e) =>
            setForm({ ...form, dependencia_domicilio_legal: e.target.value })
          }
          disabled={bloqueadoPaso}
        />
      </div>

      {!bloqueadoPaso && (
        <button
          onClick={guardar}
          disabled={guardando}
          className="px-6 py-2 bg-[#53b431] text-white rounded-lg hover:bg-[#459b28] transition-colors"
        >
          {guardando ? "Guardando..." : "Guardar y continuar"}
        </button>
      )}
    </div>
  );
}
