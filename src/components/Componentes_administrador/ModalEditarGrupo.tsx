"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export interface Grupo {
  id_grupos: number;
  nombre_grupo: string;
  _count?: { contactos: number };
}

interface ModalEditarGrupoProps {
  abierto: boolean;
  grupo: Grupo | null;
  onClose: () => void;
  onUpdated: () => void; // el padre refresca la lista
}

export function ModalEditarGrupo({
  abierto,
  grupo,
  onClose,
  onUpdated,
}: ModalEditarGrupoProps) {
  const [nombre, setNombre] = useState("");

  // Sincroniza el nombre al abrir con el grupo actual
  useEffect(() => {
    if (abierto && grupo) setNombre(grupo.nombre_grupo);
  }, [abierto, grupo]);

  if (!abierto || !grupo) return null;

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = nombre.trim();
    if (!limpio) {
      toast.error("El nombre del grupo es obligatorio");
      return;
    }

    try {
      await axios.put(`/api/Admin/Contacto/Grupos/${grupo.id_grupos}`, {
        nombre_grupo: limpio,
      });
      toast.success("Grupo actualizado correctamente");
      onUpdated(); // que el padre recargue los datos
      onClose();   // cierra el modal
    } catch (err: any) {
      console.error("Error al actualizar grupo:", err);
      toast.error(err.response?.data?.error || "Error al actualizar grupo");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <form
        onSubmit={manejarSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-black"
      >
        <h2 className="text-lg font-semibold text-[#011848] mb-4">
          Editar grupo
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">Nombre del grupo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
            placeholder="Ej. Departamento de Ventas"
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-white bg-[#011848] hover:bg-[#022063] transition"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
