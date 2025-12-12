// src/app/(dashboard)/BolsaTrabajo/Postulaciones/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
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

  // Estados de modales
  const [modalAccion, setModalAccion] = useState<"aprobar" | "rechazar" | null>(
    null
  );
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [processing, setProcessing] = useState(false);

  // Cargar postulaciones
  useEffect(() => {
    if (!id || session === undefined) return;

    fetch(`/api/Ofertas/${id}/Postulaciones`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setPostulaciones(data.postulaciones);
      })
      .finally(() => setLoading(false));
  }, [id, session]);

  // -----------------------------
  // ACTUALIZAR ESTADO
  // -----------------------------
  const cambiarEstado = async (
    postulacionId: number,
    accion: "aprobar" | "rechazar"
  ) => {
    if (!session?.user) return;

    setProcessing(true);

    try {
      const res = await fetch(
        `/api/Postulaciones/${postulacionId}/estadoVacante`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accion,
            revisadoPorUsuarioId: session.user.id,
            mensaje: accion === "rechazar" ? motivoRechazo : undefined,
          }),
        }
      );

      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      // Actualizar lista
      setPostulaciones((prev) =>
        prev.map((post) =>
          post.id_postulaciones === postulacionId
            ? {
                ...post,
                estado: {
                  ...post.estado,
                  nombre_estado: accion === "aprobar" ? "Aprobado" : "Rechazado",
                  id_postulacion_estados: accion === "aprobar" ? 3 : 4,
                },
                mensaje: accion === "rechazar" ? motivoRechazo : post.mensaje,
              }
            : post
        )
      );

      // Actualizar modal abierto
      setSelectedPostulante((prev) =>
        prev && prev.id_postulaciones === postulacionId
          ? {
              ...prev,
              estado: {
                ...prev.estado,
                nombre_estado: accion === "aprobar" ? "Aprobado" : "Rechazado",
                id_postulacion_estados: accion === "aprobar" ? 3 : 4,
              },
              mensaje: accion === "rechazar" ? motivoRechazo : prev.mensaje,
            }
          : prev
      );

      setModalAccion(null);
      setMotivoRechazo("");
    } catch (error) {
      console.error("Error cambiando estado:", error);
    } finally {
      setProcessing(false);
    }
  };

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
            className="bg-white rounded-xl shadow p-4"
          >
            <div className="flex justify-between items-center">
              {/* Información */}
              <div className="flex items-center gap-4">
                {p.usuario.foto_perfil ? (
                  <Image
                    src={p.usuario.foto_perfil}
                    alt="Foto"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    ?
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(p.creado_en).toLocaleDateString()}
                  </p>
                  <p className="font-semibold">{p.usuario.nombre}</p>
                  <p className="text-gray-600">{p.usuario.correo}</p>
                </div>
              </div>

              <button
                className="text-blue-600 underline"
                onClick={() => setSelectedPostulante(p)}
              >
                Ver detalles
              </button>
            </div>

            {/* Modal principal */}
            <AnimatePresence>
              {selectedPostulante &&
                selectedPostulante.id_postulaciones === p.id_postulaciones && (
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="bg-white p-6 rounded-2xl max-w-lg w-full shadow"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                    >
                      {/* Datos */}
                      <div className="flex justify-center mb-4">
                        {selectedPostulante.usuario.foto_perfil ? (
                          <Image
                            src={selectedPostulante.usuario.foto_perfil}
                            width={96}
                            height={96}
                            className="rounded-full object-cover border"
                            alt=""
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border">
                            ?
                          </div>
                        )}
                      </div>

                      <h2 className="text-xl font-bold text-center">
                        {selectedPostulante.usuario.nombre}{" "}
                        {selectedPostulante.usuario.apellido}
                      </h2>

                      <p>
                        <strong>Correo:</strong>{" "}
                        {selectedPostulante.usuario.correo}
                      </p>

                      <p>
                        <strong>CV:</strong>{" "}
                        {selectedPostulante.usuario.cv_url ? (
                          <a
                            href={selectedPostulante.usuario.cv_url}
                            target="_blank"
                            className="text-blue-600 underline"
                          >
                            Ver CV
                          </a>
                        ) : (
                          "No disponible"
                        )}
                      </p>

                      <p>
                        <strong>Estado:</strong>{" "}
                        {selectedPostulante.estado.nombre_estado}
                      </p>

                      {/* BOTONES */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => setModalAccion("aprobar")}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          disabled={
                            selectedPostulante.estado.id_postulacion_estados >=
                            3
                          }
                        >
                          Aprobar
                        </button>

                        <button
                          onClick={() => setModalAccion("rechazar")}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          disabled={
                            selectedPostulante.estado.id_postulacion_estados >=
                            3
                          }
                        >
                          Rechazar
                        </button>
                      </div>

                      <button
                        onClick={() => setSelectedPostulante(null)}
                        className="mt-4 w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
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

      {/* MODAL DE APROBACIÓN */}
      <AnimatePresence>
        {modalAccion === "aprobar" && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Confirmar aprobación</h2>
              <p>¿Seguro que deseas aprobar esta postulación?</p>

              <div className="flex gap-2 mt-4">
                <button
                  disabled={processing}
                  onClick={() =>
                    cambiarEstado(selectedPostulante!.id_postulaciones, "aprobar")
                  }
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  {processing ? "Procesando..." : "Sí, aprobar"}
                </button>
                <button
                  onClick={() => setModalAccion(null)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE RECHAZO */}
      <AnimatePresence>
        {modalAccion === "rechazar" && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Rechazar postulación</h2>

              <textarea
                className="w-full border p-2 rounded mb-3"
                rows={4}
                placeholder="Escribe el motivo del rechazo..."
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
              />

              <div className="flex gap-2">
                <button
                  disabled={processing || motivoRechazo.trim().length === 0}
                  onClick={() =>
                    cambiarEstado(
                      selectedPostulante!.id_postulaciones,
                      "rechazar"
                    )
                  }
                  className="px-3 py-1 bg-red-600 text-white rounded disabled:bg-red-300"
                >
                  {processing ? "Procesando..." : "Rechazar"}
                </button>
                <button
                  onClick={() => {
                    setMotivoRechazo("");
                    setModalAccion(null);
                  }}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
