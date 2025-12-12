"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ModalEditarGrupo } from "@/components/Componentes_administrador/ModalEditarGrupo";
import ModalConfirmacion from "@/components/ModalConfirmacionAdmin";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react";
import PaginaNoPermisos from "@/app/PaginaNoAutorizada/NoPermisos/page";

interface Grupo {
  id_grupos: number;
  nombre_grupo: string;
  _count: {
    contactos: number;
  };
}

export default function AdminGrupos() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [nuevoGrupo, setNuevoGrupo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<Grupo | null>(
    null
  );
  const [modalEliminar, setModalEliminar] = useState(false);

  const [confirmando, setConfirmando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const gruposFiltrados = grupos.filter(
    (g) =>
      g.nombre_grupo &&
      g.nombre_grupo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const [paginaActual, setPaginaActual] = useState(1);
  const gruposPorPagina = 10;

  const indiceUltimo = paginaActual * gruposPorPagina;
  const indicePrimero = indiceUltimo - gruposPorPagina;
  const gruposPaginados = gruposFiltrados.slice(indicePrimero, indiceUltimo);

  const totalPaginas = Math.ceil(gruposFiltrados.length / gruposPorPagina);

  const abrirModalEliminar = (grupo: Grupo) => {
    setGrupoSeleccionado(grupo);
    setModalEliminar(true);
  };

  const cerrarModalEliminar = () => {
    setGrupoSeleccionado(null);
    setModalEliminar(false);
  };

  const cargarGrupos = async () => {
    try {
      const res = await axios.get<Grupo[]>("/api/Admin/Contacto/Grupos/valida");
      setGrupos(res.data);
    } catch {
      toast.error("No se pudieron cargar los grupos");
    }
  };

  const abrirModalEditar = (grupo: Grupo) => {
    setGrupoSeleccionado(grupo);
    setModalEditar(true);
  };
  const cerrarModalEditar = () => {
    setGrupoSeleccionado(null);
    setModalEditar(false);
  };

  // 🔹 Cargar grupos al montar
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const res = await axios.get<Grupo[]>("/api/Admin/Contacto/Grupos");
        setGrupos(res.data);
      } catch (err) {
        console.error("Error al cargar grupos:", err);
        toast.error("No se pudieron cargar los grupos");
      }
    };
    fetchGrupos();
  }, []);

  if (role === "Personal-Plantel") {
    return <PaginaNoPermisos />;
  }
  // 🔹 Crear grupo
  const manejarCrearGrupo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoGrupo.trim()) {
      toast.error("El nombre del grupo es obligatorio");
      return;
    }

    try {
      setCargando(true);
      const res = await axios.post("/api/Admin/Contacto/Grupos/valida", {
        nombre_grupo: nuevoGrupo,
      });
      toast.success("Grupo creado correctamente");
      setGrupos(res.data); // añadir al inicio
      setNuevoGrupo("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Error al crear grupo:", err);
        toast.error(err.response?.data?.error || "No se pudo crear el grupo");
      } else {
        console.error("Error inesperado:", err);
        toast.error("No se pudo crear el grupo");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg text-black space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#011848] flex items-center gap-2">
          Administración de Grupos
        </h2>
        <span className="px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-700">
          {grupos.length} grupos
        </span>
      </div>

      {/* Toolbar: búsqueda + crear */}
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar grupo..."
          className="border rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-[#011848]"
        />
        <form onSubmit={manejarCrearGrupo} className="flex gap-3 items-center">
          <input
            type="text"
            value={nuevoGrupo}
            onChange={(e) => setNuevoGrupo(e.target.value)}
            placeholder="Nuevo grupo..."
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#011848] focus:border-[#011848]"
          />
          <button
            type="submit"
            disabled={cargando}
            className="px-5 py-2 rounded-lg text-white bg-[#011848] hover:bg-[#022063] transition disabled:bg-gray-400"
          >
            {cargando ? "Creando..." : "Crear"}
          </button>
        </form>
      </div>

      {/* Lista de grupos */}
      {grupos.length === 0 ? (
        <div className="text-center text-gray-500 italic py-6">
          No hay grupos registrados aún.
        </div>
      ) : (
        <div className="overflow-hidden border rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#011848] text-white">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2 text-center">Contactos</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gruposPaginados.map((grupo, idx) => (
                <tr
                  key={grupo.id_grupos}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {grupo.id_grupos}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {grupo.nombre_grupo}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {grupo._count.contactos || "Sin datos"}
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-3">
                    <button
                      onClick={() => abrirModalEditar(grupo)}
                      className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => abrirModalEliminar(grupo)}
                      className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={paginaActual === 1}
          onClick={() => setPaginaActual(paginaActual - 1)}
          className="px-3 py-1 rounded-full border disabled:opacity-50"
        >
          ←
        </button>
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => setPaginaActual(i + 1)}
            className={`px-3 py-1 rounded-full border ${
              paginaActual === i + 1 ? "bg-[#011848] text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={paginaActual === totalPaginas}
          onClick={() => setPaginaActual(paginaActual + 1)}
          className="px-3 py-1 rounded-full border disabled:opacity-50"
        >
          →
        </button>
      </div>

      {/* Modales */}
      <ModalEditarGrupo
        abierto={modalEditar}
        grupo={grupoSeleccionado}
        onClose={cerrarModalEditar}
        onUpdated={cargarGrupos}
      />
      <ModalConfirmacion
        abierto={modalEliminar}
        titulo="Eliminar grupo"
        mensaje={`¿Seguro que deseas eliminar el grupo "${grupoSeleccionado?.nombre_grupo}"?`}
        tipo="eliminar"
        confirmando={confirmando}
        onCancelar={cerrarModalEliminar}
        onConfirmar={async () => {
          if (!grupoSeleccionado) return;
          try {
            setConfirmando(true);
            await axios.delete(
              `/api/Admin/Contacto/Grupos/${grupoSeleccionado.id_grupos}`
            );
            toast.success("Grupo eliminado correctamente");
            cerrarModalEliminar();
            cargarGrupos();
          } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
              // 👇 aquí sí debería mostrar el mensaje del backend
              toast.error(
                err.response?.data?.error || "Error al eliminar grupo"
              );
            } else {
              toast.error("Error inesperado al eliminar grupo");
            }
            // ❌ no cierres el modal aquí, deja que el usuario vea el error
          } finally {
            setConfirmando(false);
          }
        }}
      />
    </div>
  );
}
