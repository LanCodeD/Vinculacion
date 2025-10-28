"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PostulacionUsuario {
  id_postulaciones: number;
  creado_en: string;
  estado: { id_postulacion_estados: number; nombre_estado: string };
  oferta: { id_ofertas: number; titulo: string; vacante: string; descripcion_general: string };
}

export default function MisPostulaciones() {
  const [postulaciones, setPostulaciones] = useState<PostulacionUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOferta, setSelectedOferta] = useState<PostulacionUsuario | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    fetch("/api/Postulaciones/MisPostulaciones")
      .then(res => res.json())
      .then(data => {
        if (data.ok) setPostulaciones(data.postulaciones);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Deseas eliminar esta postulación?")) return;
    const res = await fetch(`/api/Postulaciones/${id}/EliminarMiPostulacion`, { method: "DELETE" });
    const data = await res.json();
    if (!data.ok) return alert(data.error);
    setPostulaciones(prev => prev.filter(p => p.id_postulaciones !== id));
    alert("Postulación eliminada ✅");
  };

  const formatearFecha = (fecha?: string, conHora = false) => {
    if (!fecha) return "Sin fecha";

    // Asegurar formato compatible con Date
    const fechaISO = fecha.replace(" ", "T");
    const d = new Date(fechaISO);

    if (isNaN(d.getTime())) return "Fecha no válida";

    const opciones: Intl.DateTimeFormatOptions = conHora
      ? {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
      : {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };

    return d.toLocaleString("es-ES", opciones);
  };


  if (loading) return <p className="p-6">Cargando postulaciones...</p>;
  if (postulaciones.length === 0) return <p className="p-6">No tienes postulaciones.</p>;

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Postulaciones</h1>
      <div className="space-y-4">
        {postulaciones.map((p) => (
          <div
            key={p.id_postulaciones}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-center hover:shadow-lg transition"
          >
            {/* Información principal */}
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">
                {formatearFecha(p.creado_en)}
              </p>
              <h2 className="font-semibold text-lg">
                {p.oferta.vacante ?? "Vacante sin nombre"}
              </h2>
              <p className="text-gray-600">{p.oferta.titulo ?? "Empresa desconocida"}</p>
              <p
                className={`mt-1 font-medium text-sm ${p.estado.nombre_estado.toLowerCase() === "finalizado"
                  ? "text-red-500"
                  : "text-green-500"
                  }`}
              >
                {p.estado.nombre_estado}
              </p>
            </div>

            {/* Acciones */}
            <div className="flex flex-col items-center justify-center gap-2 ml-4">
              {/* Ver detalles */}
              <div className="flex flex-col items-center justify-center gap-2 ml-4">
                {/* Ver detalles (icono de ojo) */}
                <button
                  onClick={() => {
                    setSelectedOferta(p);
                    setShowFullDesc(false);
                  }}
                  className="text-gray-400 hover:text-blue-600 transition"
                  title="Ver detalles"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>

                {/* Darse de baja (icono de papelera) */}
                <button
                  onClick={() => {
                    if (window.confirm("¿Estás seguro de que quieres darte de baja?")) {
                      handleEliminar(p.id_postulaciones);
                    }
                  }}
                  className="text-gray-400 hover:text-red-600 transition"
                  title="Darse de baja"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 3h6a1 1 0 011 1v1H8V4a1 1 0 011-1z"
                    />
                  </svg>
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Modal con fondo difuminado */}
      <AnimatePresence>
        {selectedOferta && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/90 p-6 rounded-2xl shadow-xl max-w-lg w-full border border-gray-200"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {selectedOferta.oferta.titulo ?? "Sin título"}
              </h2>

              <p className="mb-1 text-gray-700">
                <strong>Empresa:</strong> {selectedOferta.oferta.titulo ?? "No especificada"}
              </p>
              <p className="mb-1 text-gray-700">
                <strong>Estado:</strong> {selectedOferta.estado.nombre_estado ?? "Desconocido"}
              </p>
              <p className="mb-1 text-gray-700">
                <strong>Postulado el:</strong> {formatearFecha(selectedOferta.creado_en, true)}
              </p>

              {/* Descripción segura con "Leer más" */}
              {selectedOferta.oferta.descripcion_general ? (
                <>
                  <p className="mt-3 text-gray-800">
                    <strong>Descripción:</strong>{" "}
                    {showFullDesc
                      ? selectedOferta.oferta.descripcion_general
                      : selectedOferta.oferta.descripcion_general.length > 100
                        ? selectedOferta.oferta.descripcion_general.slice(0, 100) + "..."
                        : selectedOferta.oferta.descripcion_general}
                  </p>
                  {selectedOferta.oferta.descripcion_general.length > 100 && (
                    <button
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm mt-2 transition-colors duration-200"
                    >
                      {showFullDesc ? "Mostrar menos" : "Leer más"}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${showFullDesc ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                <p className="mt-3 text-gray-800">
                  <strong>Descripción:</strong> Sin descripción disponible.
                </p>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setSelectedOferta(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
