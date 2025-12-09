// src/app/(dashboard)/BolsaTrabajo/Postulaciones/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Postulacion {
  id_postulaciones: number;
  mensaje: string;
  creado_en: string;
  estado: {
    id_postulacion_estados: number;
    nombre_estado: string;
  };
  usuario: {
    id_usuarios: number;
    foto_perfil: string;
    nombre: string;
    apellido: string;
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
  const [selectedPostulante, setSelectedPostulante] =
    useState<Postulacion | null>(null);

  useEffect(() => {
    if (!id) return;
    if (session === undefined) return;

    fetch(`/api/Ofertas/${id}/Postulaciones`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setPostulaciones(data.postulaciones);
      })
      .finally(() => setLoading(false));
  }, [id, session]);

  // -----------------------------
  // FUNCION DE CONFIRMACIÓN CON TOAST
  // -----------------------------
  const confirmarCambioEstado = (
    postulacionId: number,
    accion: "aprobar" | "rechazar",
  ) => {
    if (!session?.user) {
      toast("Debes iniciar sesión");
      return;
    }

    const accionTexto = accion === "aprobar" ? "aprobar" : "rechazar";

    toast((t) => {
      let textoLocal = ""; // ⭐ estado LOCAL por toast

      return (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm text-gray-800">
            ¿Seguro que quieres {accionTexto} esta postulación?
            *Una vez que se seleccione no se podra cambiar*
          </p>

          {accion === "rechazar" && (
            <textarea
              placeholder="Escribe el motivo del rechazo"
              className="border rounded p-2 w-full text-sm"
              onChange={(e) => {
                textoLocal = e.target.value; // ⭐ guarda localmente
              }}
            />
          )}

          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const toastId = toast.loading("Procesando...");

                try {
                  const res = await fetch(
                    `/api/Postulaciones/${postulacionId}/estadoVacante`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        accion,
                        revisadoPorUsuarioId: session.user.id,
                        mensaje: accion === "rechazar" ? textoLocal : undefined, // ⭐ ENVÍA el texto correcto
                      }),
                    }
                  );

                  const data = await res.json();
                  if (!data.ok)
                    throw new Error(data.error || "Error al actualizar el estado");

                  // actualizar lista
                  setPostulaciones((prev) =>
                    prev.map((p) =>
                      p.id_postulaciones === postulacionId
                        ? {
                          ...p,
                          estado: data.postulacion.estado,
                          mensaje: data.postulacion.mensaje ?? p.mensaje,
                        }
                        : p
                    )
                  );

                  // actualizar modal si está abierto
                  if (selectedPostulante?.id_postulaciones === postulacionId) {
                    setSelectedPostulante((prev) =>
                      prev
                        ? {
                          ...prev,
                          estado: data.postulacion.estado,
                          mensaje: data.postulacion.mensaje ?? prev.mensaje,
                        }
                        : null
                    );
                  }

                  toast.success(
                    `Postulación ${accion === "aprobar" ? "aprobada" : "rechazada"
                    }`,
                    { id: toastId }
                  );
                } catch (err) {
                  console.error(err);
                  toast.error("❌ Error al actualizar la postulación", {
                    id: toastId,
                  });
                }
              }}
              className={`px-3 py-1 text-white rounded ${accion === "aprobar"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
                }`}
            >
              Sí
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 hover:bg-gray-400 text-xs px-3 py-1 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      );
    });
  }

  if (loading) return <p className="p-6">Cargando postulaciones...</p>;
  if (postulaciones.length === 0)
    return <p className="p-6">No hay postulaciones aún.</p>;

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Postulaciones</h1>

      <div className="space-y-4">
        {postulaciones.map((p) => (
          <motion.div
            key={p.id_postulaciones}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
          >
            {/* Resumen */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                {/* Foto de perfil en la card */}
                {p.usuario.foto_perfil ? (
                  <Image
                    src={p.usuario.foto_perfil}
                    alt={p.usuario.nombre + " foto"}
                    width={48} // 👈 ancho en px
                    height={48} // 👈 alto en px
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    ?
                  </div>
                )}

                <div>
                  <p className="text-gray-500 text-sm">
                    {new Date(p.creado_en).toLocaleDateString()}
                  </p>
                  <h2 className="text-lg font-semibold">
                    {p.usuario.nombre + " " + (p.usuario.apellido ?? "")}
                  </h2>
                  <p className="text-gray-600">{p.usuario.correo}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPostulante(p)}
                className="text-blue-600 font-medium hover:underline"
              >
                Ver detalles
              </button>
            </div>

            {/* Modal de detalles */}
            <AnimatePresence>
              {selectedPostulante &&
                selectedPostulante.id_postulaciones === p.id_postulaciones && (
                  <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full border border-gray-200"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Foto de perfil en el modal */}
                      <div className="flex justify-center mb-4">
                        {selectedPostulante.usuario.foto_perfil ? (
                          <Image
                            src={selectedPostulante.usuario.foto_perfil}
                            alt={selectedPostulante.usuario.nombre + " foto"}
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-gray-300">
                            ?
                          </div>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold mb-2 text-center">
                        {selectedPostulante.usuario.nombre +
                          " " +
                          (selectedPostulante.usuario.apellido ?? "")}
                      </h2>
                      <p>
                        <strong>Correo:</strong>{" "}
                        {selectedPostulante.usuario.correo}
                      </p>
                      <p>
                        <strong>Título:</strong>{" "}
                        {selectedPostulante.usuario.titulo}
                      </p>
                      <p>
                        <strong>Matrícula:</strong>{" "}
                        {selectedPostulante.usuario.matricula}
                      </p>
                      <p>
                        <strong>CV:</strong>{" "}
                        {selectedPostulante.usuario.cv_url ? (
                          <a
                            href={selectedPostulante.usuario.cv_url}
                            target="_blank"
                            className="text-indigo-600 underline"
                          >
                            Ver CV
                          </a>
                        ) : (
                          <span className="text-gray-400">No disponible</span>
                        )}
                      </p>
                      <p>
                        <strong>Estado:</strong>{" "}
                        {selectedPostulante.estado.nombre_estado}
                      </p>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() =>
                            confirmarCambioEstado(selectedPostulante.id_postulaciones, "aprobar")
                          }
                          className={`px-3 py-1 rounded text-white ${selectedPostulante.estado.id_postulacion_estados === 3 ||
                              selectedPostulante.estado.id_postulacion_estados === 4
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                            }`}
                          disabled={
                            selectedPostulante.estado.id_postulacion_estados === 3 ||
                            selectedPostulante.estado.id_postulacion_estados === 4
                          }
                        >
                          Aprobar
                        </button>

                        <button
                          onClick={() =>
                            confirmarCambioEstado(selectedPostulante.id_postulaciones, "rechazar")
                          }
                          className={`px-3 py-1 rounded text-white ${selectedPostulante.estado.id_postulacion_estados === 3 ||
                              selectedPostulante.estado.id_postulacion_estados === 4
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                            }`}
                          disabled={
                            selectedPostulante.estado.id_postulacion_estados === 3 ||
                            selectedPostulante.estado.id_postulacion_estados === 4
                          }
                        >
                          Rechazar
                        </button>
                      </div>

                      <button
                        onClick={() => setSelectedPostulante(null)}
                        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
                      >
                        Cerrar
                      </button>
                    </motion.div>
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
