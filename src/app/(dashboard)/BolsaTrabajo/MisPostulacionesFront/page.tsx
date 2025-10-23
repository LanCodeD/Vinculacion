"use client";
import { useEffect, useState } from "react";

interface PostulacionUsuario {
  id_postulaciones: number;
  mensaje: string;
  estado: { id_postulacion_estados: number; nombre_estado: string };
  oferta: { id_ofertas: number; titulo: string; empresa: string; descripcion: string };
}

export default function MisPostulaciones() {
  const [postulaciones, setPostulaciones] = useState<PostulacionUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOferta, setSelectedOferta] = useState<PostulacionUsuario["oferta"] | null>(null);

  useEffect(() => {
    fetch("/api/Postulaciones/MisPostulaciones")
      .then(res => res.json())
      .then(data => { if (data.ok) setPostulaciones(data.postulaciones); })
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

  if (loading) return <p className="p-6">Cargando postulaciones...</p>;
  if (postulaciones.length === 0) return <p className="p-6">No tienes postulaciones.</p>;

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Postulaciones</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Vacante</th>
              <th className="px-4 py-2 border">Empresa</th>
              <th className="px-4 py-2 border">Mensaje</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {postulaciones.map(p => (
              <tr key={p.id_postulaciones}>
                <td className="px-4 py-2 border">{p.oferta.titulo}</td>
                <td className="px-4 py-2 border">{p.oferta.empresa}</td>
                <td className="px-4 py-2 border">{p.mensaje}</td>
                <td className="px-4 py-2 border">{p.estado.nombre_estado}</td>
                <td className="px-4 py-2 border flex gap-2">
                  <button
                    onClick={() => setSelectedOferta(p.oferta)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Ver detalles
                  </button>
                  <button
                    onClick={() => handleEliminar(p.id_postulaciones)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedOferta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-2">{selectedOferta.titulo}</h2>
            <p className="mb-2"><strong>Empresa:</strong> {selectedOferta.empresa}</p>
            <p className="mb-4"><strong>Descripción:</strong> {selectedOferta.descripcion}</p>
            <button
              onClick={() => setSelectedOferta(null)}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
