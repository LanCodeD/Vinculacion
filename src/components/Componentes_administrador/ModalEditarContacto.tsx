import { AnimatePresence, motion } from "framer-motion";
import Select, { SingleValue } from "react-select";
import { useEffect, useState } from "react";
import { Contacto } from "@/app/Admin/Contactos/page"; // tu interfaz centralizada
import axios from "axios";
import toast from "react-hot-toast";

interface OptionType {
  value: number;
  label: string;
}

interface ModalEditarContactoProps {
  abierto: boolean;
  onClose: () => void;
  onUpdated: () => void;
  contacto: Contacto | null;
  empresas: { id_empresas: number; nombre_comercial: string }[];
  grupos: { id_grupos: number; nombre_grupo: string }[];
  activos: { id_contacto_estados: number; nombre_estado: string }[];
}

export default function ModalEditarContacto({
  abierto,
  onClose,
  onUpdated,
  contacto,
  empresas,
  grupos,
  activos,
}: ModalEditarContactoProps) {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number | null>(
    contacto?.empresas?.id_empresas ?? null
  );
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number | null>(
    contacto?.grupos?.id_grupos ?? null
  );
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<number>(
    contacto?.contacto_estados?.id_contacto_estados ?? 1
  );

  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (contacto) {
      setEmpresaSeleccionada(contacto.empresas?.id_empresas ?? null);
      setGrupoSeleccionado(contacto.grupos?.id_grupos ?? null);
      setEstadoSeleccionado(
        contacto.contacto_estados?.id_contacto_estados ?? 2
      );
    }
  }, [contacto]);

  if (!abierto || !contacto) return null;

  const manejarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setCargando(true);
      await axios.put(`/api/Admin/Contacto/${contacto.id_contactos}`, {
        nombre: formData.get("nombre"),
        apellido: formData.get("apellido"),
        correo: formData.get("correo"),
        puesto: formData.get("puesto"),
        celular: formData.get("celular"),
        titulo: formData.get("titulo"),
        empresas_id: empresaSeleccionada,
        grupos_id: grupoSeleccionado,
        es_representante: formData.get("es_representante") ? 1 : 0,
        contacto_estados_id: estadoSeleccionado, // 👈 nuevo campo
      });
      toast.success("Contacto actualizado correctamente");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error al actualizar contacto:", err);
      toast.error("Error al actualizar el contacto");
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
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] p-6 text-black overflow-y-auto"
          >
            <h2 className="text-xl font-semibold text-[#011848] mb-4">
              Editar Contacto
            </h2>

            {/* 🔹 Nombre + Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                  name="nombre"
                  defaultValue={contacto.nombre ?? ""}
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Apellido</label>
                <input
                  name="apellido"
                  defaultValue={contacto.apellido ?? ""}
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
                />
              </div>
            </div>

            {/* 🔹 Correo */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Correo</label>
              <input
                type="email"
                name="correo"
                defaultValue={contacto.correo ?? ""}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
              />
            </div>

            {/* 🔹 Título + Puesto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium">Grado Académico</label>
                <input
                  name="titulo"
                  defaultValue={contacto.titulo ?? ""}
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
                  placeholder="Ej. Lic., Ing., Dr."
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Puesto</label>
                <input
                  name="puesto"
                  defaultValue={contacto.puesto ?? ""}
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
                />
              </div>
            </div>

            {/* 🔹 Celular */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Celular</label>
              <input
                name="celular"
                defaultValue={contacto.celular ?? ""}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
              />
            </div>

            {/* 🔹 Estado */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Estado</label>
              <Select
                value={
                  estadoSeleccionado
                    ? {
                        value: estadoSeleccionado,
                        label:
                          activos.find(
                            (e) => e.id_contacto_estados === estadoSeleccionado
                          )?.nombre_estado || "Activo",
                      }
                    : null
                }
                options={activos.map((e) => ({
                  value: e.id_contacto_estados,
                  label: e.nombre_estado,
                }))}
                className="mt-1"
                classNamePrefix="react-select"
                placeholder="Seleccione estado..."
                isSearchable={false}
                onChange={(opt: SingleValue<OptionType>) =>
                  setEstadoSeleccionado(opt ? opt.value : 1)
                }
              />
            </div>

            {/* 🔹 Empresa */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Empresa</label>
              <Select
                defaultValue={
                  contacto.empresas
                    ? {
                        value: contacto.empresas.id_empresas,
                        label: contacto.empresas.nombre_comercial,
                      }
                    : null
                }
                options={empresas.map((e) => ({
                  value: e.id_empresas,
                  label: e.nombre_comercial,
                }))}
                className="mt-1"
                classNamePrefix="react-select"
                placeholder="Escriba para buscar empresa..."
                isSearchable
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
                defaultValue={
                  contacto.grupos
                    ? {
                        value: contacto.grupos.id_grupos,
                        label: contacto.grupos.nombre_grupo,
                      }
                    : null
                }
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
              <input
                type="checkbox"
                name="es_representante"
                defaultChecked={contacto.es_representante === 1}
              />
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
                className="px-4 py-2 rounded-lg text-white bg-[#011848] hover:bg-[#022063] transition disabled:bg-gray-400"
              >
                {cargando ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
