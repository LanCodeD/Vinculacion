// src/app/(dashboard)/BolsaTrabajo/Postulaciones/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface Postulacion {
  id_postulaciones: number;
  mensaje: string;
  estado: {
    id_postulacion_estados: number;
    nombre_estado: string;
  };
  usuario: {
    id_usuarios: number;
    nombre: string;
    correo: string;
    celular?: string;
    titulo?: string;
    matricula?: string;
    fecha_egreso?: string | null;
    cv_url?: string | null;
  };
}

export default function PostulacionesPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/Ofertas/${id}/Postulaciones`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setPostulaciones(data.postulaciones);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCambioEstado = async (
    postulacionId: number,
    accion: "aprobar" | "rechazar"
  ) => {
    if (!session?.user) {
      alert("Debes iniciar sesión");
      return;
    }

    const confirmar = confirm(
      `¿Seguro que quieres ${
        accion === "aprobar" ? "aprobar ✅" : "rechazar ❌"
      } esta postulación?`
    );
    if (!confirmar) return;

    try {
      setLoading(true);

      const res = await fetch(
        `/api/Postulaciones/${postulacionId}/estadoVacante`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accion,
            revisadoPorUsuarioId: session.user.id,
          }),
        }
      );

      const data = await res.json();
      if (!data.ok)
        throw new Error(data.error || "Error al actualizar el estado");

      setPostulaciones((prev) =>
        prev.map((p) =>
          p.id_postulaciones === postulacionId
            ? { ...p, estado: data.postulacion.estado }
            : p
        )
      );

      alert("✅ Estado actualizado correctamente");
    } catch (err: unknown) {
      console.error("❌ Error:", err);
      if (err instanceof Error) {
        alert(`❌ ${err.message}`);
      } else {
        alert("❌ Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Cargando postulaciones...</p>;
  if (postulaciones.length === 0)
    return <p className="p-6">No hay postulaciones aún.</p>;

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Postulaciones</h1>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-700">
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Correo</th>
              <th className="px-4 py-2 border">Título</th>
              <th className="px-4 py-2 border">Matrícula</th>
              <th className="px-4 py-2 border">CV</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {postulaciones.map((p) => (
              <tr key={p.id_postulaciones} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{p.usuario.nombre}</td>
                <td className="px-4 py-2 border">{p.usuario.correo}</td>
                <td className="px-4 py-2 border">{p.usuario.titulo}</td>
                <td className="px-4 py-2 border">{p.usuario.matricula}</td>
                <td className="px-4 py-2 border text-center">
                  {p.usuario.cv_url ? (
                    <a
                      href={p.usuario.cv_url}
                      target="_blank"
                      className="text-indigo-600 underline"
                    >
                      Ver CV
                    </a>
                  ) : (
                    <span className="text-gray-400">No disponible</span>
                  )}
                </td>
                <td className="px-4 py-2 border">{p.estado.nombre_estado}</td>
                <td className="px-4 py-2 border text-center space-x-2">
                  <button
                    onClick={() =>
                      handleCambioEstado(p.id_postulaciones, "aprobar")
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() =>
                      handleCambioEstado(p.id_postulaciones, "rechazar")
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
