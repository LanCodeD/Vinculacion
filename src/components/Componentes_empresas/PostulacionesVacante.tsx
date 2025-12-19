// src/components/Componentes_empresas/PostulacionesVacante.tsx
"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  };
}

interface Props {
  idOferta: number;
  usuarioEmpresaId: number; // ID del usuario empresa logueado
}

export default function PostulacionesVacante({
  idOferta,
  usuarioEmpresaId,
}: Props) {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cargar postulaciones
  useEffect(() => {
    if (!idOferta) {
      console.warn("No se recibió idOferta");
      return;
    }

    console.log("Cargando postulaciones para oferta:", idOferta);

    setLoading(true);
    setError(null);

    fetch(`/api/Ofertas/${idOferta}/Postulaciones`)
      .then(async (res) => {
        console.log("Status de respuesta:", res.status);
        const data = await res.json();
        console.log("Data recibida:", data);

        if (data.ok) {
          setPostulaciones(data.postulaciones);
        } else {
          setError(data.error || "Error desconocido al cargar postulaciones");
        }
      })
      .catch((err) => {
        console.error("Error en fetch:", err);
        setError("Error al conectar con el servidor");
      })
      .finally(() => setLoading(false));
  }, [idOferta]);

  // Cambiar estado de la postulación
  async function actualizarEstado(
    idPostulacion: number,
    accion: "aprobar" | "rechazar" | "revisar"
  ) {
    try {
      setUpdating(idPostulacion);

      const res = await fetch(`/api/Postulaciones/${idPostulacion}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion,
          revisadoPorUsuarioId: usuarioEmpresaId,
        }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Error al actualizar estado");

      // Actualizar UI sin recargar página
      setPostulaciones((prev) =>
        prev.map((p) =>
          p.id_postulaciones === idPostulacion
            ? {
                ...p,
                estado: {
                  ...p.estado,
                  nombre_estado:
                    accion === "aprobar"
                      ? "Aprobada"
                      : accion === "rechazar"
                      ? "Rechazada"
                      : "En revisión",
                },
              }
            : p
        )
      );
    } catch (err: unknown) {
      const mensaje =
        err instanceof Error
          ? err.message
          : "Error desconocido al actualizar estado";
      toast.error(`${mensaje}`);
    } finally {
      setUpdating(null);
    }
  }

  // Renderizado
  if (loading) return <p className="p-6">Cargando postulaciones...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (postulaciones.length === 0)
    return <p className="p-6">No hay postulaciones para esta vacante.</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        Postulaciones recibidas ({postulaciones.length})
      </h2>
      <ul className="divide-y divide-gray-200">
        {postulaciones.map((p) => (
          <li key={p.id_postulaciones} className="py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-gray-900">{p.usuario.nombre}</p>
                <p className="text-sm text-gray-600">{p.usuario.correo}</p>
                <p className="text-sm mt-1 text-blue-600">
                  Estado:{" "}
                  <span className="font-semibold">
                    {p.estado.nombre_estado}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 mt-3 md:mt-0">
                <button
                  disabled={updating === p.id_postulaciones}
                  onClick={() =>
                    actualizarEstado(p.id_postulaciones, "revisar")
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  En revisión
                </button>
                <button
                  disabled={updating === p.id_postulaciones}
                  onClick={() =>
                    actualizarEstado(p.id_postulaciones, "aprobar")
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Aprobar
                </button>
                <button
                  disabled={updating === p.id_postulaciones}
                  onClick={() =>
                    actualizarEstado(p.id_postulaciones, "rechazar")
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
