"use client";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useState } from "react";
import Select, { SingleValue } from "react-select";
import toast from "react-hot-toast";

interface OptionType {
  value: number;
  label: string;
}

interface ModalCrearContactoProps {
  abierto: boolean;
  onClose: () => void;
  onCreated: () => void;
  empresas: { id_empresas: number; nombre_comercial: string }[];
  grupos: { id_grupos: number; nombre_grupo: string }[];
}

export default function ModalCrearContacto({
  abierto,
  onClose,
  onCreated,
  empresas,
  grupos,
}: ModalCrearContactoProps) {
  const [cargando, setCargando] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number | null>(
    null
  );
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number | null>(
    null
  );

  const manejarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setCargando(true);
      await axios.post("/api/Admin/Contacto", {
        nombre: formData.get("nombre"),
        apellido: formData.get("apellido"),
        correo: formData.get("correo"),
        puesto: formData.get("puesto"),
        titulo: formData.get("titulo"),
        empresas_id: empresaSeleccionada, // 🔹 viene del Select
        grupos_id: grupoSeleccionado, // 🔹 viene del Select
        es_representante: formData.get("es_representante") ? 1 : 0,
      });

      toast.success("Contacto creado correctamente");
      onCreated(); // recarga lista
      onClose(); // cierra modal
    } catch (err) {
      console.error("Error al crear contacto:", err);
      toast.error("Error al crear contacto");
    } finally {
      setCargando(false);
    }
  };

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={manejarSubmit}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg p-6 text-black"
          >
            <h2 className="text-xl font-semibold text-[#011848] mb-4">
              Crear Contacto
            </h2>

            {/* 🔹 Nombre */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Nombre</label>
              <input
                name="nombre"
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
                required
              />
            </div>

            {/* 🔹 Apellido */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Apellido</label>
              <input
                name="apellido"
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
              />
            </div>

            {/* 🔹 Correo */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Correo</label>
              <input
                type="email"
                name="correo"
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
              />
            </div>
            {/* 🔹 Título */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Título</label>
              <input
                name="titulo"
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
                placeholder="Ej. Lic., Ing., Dr."
              />
            </div>

            {/* 🔹 Puesto */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Puesto</label>
              <input
                name="puesto"
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
              />
            </div>

            {/* 🔹 Empresa */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Empresa</label>
              <Select
                options={empresas.map((e) => ({
                  value: e.id_empresas,
                  label: e.nombre_comercial,
                }))}
                className="mt-1"
                classNamePrefix="react-select"
                placeholder="Escriba para buscar empresa..."
                isSearchable
                required
                onChange={(opt: SingleValue<OptionType>) =>
                  setEmpresaSeleccionada(opt ? opt.value : null)
                }
              />
            </div>

            {/* 🔹 Grupo */}
            <div className="mb-3">
              <label className="block text-sm font-medium">
                Grupo (opcional)
              </label>
              <Select
                name="grupos_id"
                options={grupos.map((g) => ({
                  value: g.id_grupos,
                  label: g.nombre_grupo,
                }))}
                className="mt-1"
                classNamePrefix="react-select"
                placeholder="Escriba para buscar grupo..."
                isSearchable
                onChange={(opt: SingleValue<OptionType>) =>
                  setGrupoSeleccionado(opt ? opt.value : null)
                }
              />
            </div>

            {/* 🔹 Representante */}
            <div className="mb-3 flex items-center gap-2">
              <input type="checkbox" name="es_representante" />
              <label className="text-sm font-medium">Es representante</label>
            </div>

            {/* 🔹 Botones */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={cargando}
                className="px-4 py-2 rounded-lg text-white bg-[#53b431] hover:bg-[#469a29] transition disabled:bg-[#9cd57e]"
              >
                {cargando ? "Creando..." : "Crear Contacto"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
