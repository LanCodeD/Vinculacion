"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ModalUsuario from "@/components/Componentes_administrador/ModalUsuario";
import type { UsuarioGestion } from "@/types/GestionUsuario"; 

export default function GestionUsuarioPage() {
  const [usuarios, setUsuarios] = useState<UsuarioGestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<UsuarioGestion | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/Admin/GestionUsuario");
      const payload = res.data;

      let lista: UsuarioGestion[] = [];

      if (Array.isArray(payload)) lista = payload;
      else if (Array.isArray(payload.gestionusuario))
        lista = payload.gestionusuario;
      else if (
        payload.gestionusuario &&
        typeof payload.gestionusuario === "object"
      )
        lista = [payload.gestionusuario];
      else lista = [];

      setUsuarios(lista);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("No se pudo cargar la lista de usuarios.");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const abrirModal = (usuario: UsuarioGestion) =>
    setUsuarioSeleccionado(usuario);
  const cerrarModal = () => setUsuarioSeleccionado(null);

  // 📦 Render principal
  if (loading) {
    return (
      <main className="p-6 text-gray-700">
        <p>Cargando lista de usuarios...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 text-red-600">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full border-collapse bg-white text-sm">
          <thead className="bg-blue-50 text-blue-900">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold">Correo</th>
              <th className="px-4 py-3 text-left font-semibold">Rol</th>
              <th className="px-4 py-3 text-left font-semibold">
                Tipo de Cuenta
              </th>
              <th className="px-4 py-3 text-left font-semibold">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id_usuarios}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">{usuario.id_usuarios}</td>
                <td className="px-4 py-3">
                  {usuario.nombre} {usuario.apellido}
                </td>
                <td className="px-4 py-3">{usuario.correo}</td>
                <td className="px-4 py-3">{usuario.roles?.nombre ?? "—"}</td>
                <td className="px-4 py-3">
                  {usuario.tipos_cuenta?.nombre ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => abrirModal(usuario)}
                  >
                    Ver más
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuarios.length === 0 && (
        <p className="mt-6 text-gray-600">No hay usuarios registrados.</p>
      )}

      {/* 🪟 Modal externo */}
      {usuarioSeleccionado && (
        <ModalUsuario
          usuario={usuarioSeleccionado}
          onClose={cerrarModal}
        />
      )}
    </main>
  );
}
