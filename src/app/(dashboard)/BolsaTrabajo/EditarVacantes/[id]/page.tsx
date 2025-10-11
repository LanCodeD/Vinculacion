"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Vacante {
  id_ofertas: number;
  titulo: string;
  descripcion: string;
  puesto: string;
  ubicacion: string;
  imagen: string;
  fecha_cierre: string;
}

export default function EditarVacantePage() {
  const params = useParams();
  const router = useRouter();
  const [vacante, setVacante] = useState<Vacante | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const id = params.id;

  useEffect(() => {
    if (!id) return;
    fetch(`/api/Ofertas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setVacante(data.vacante);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!vacante) return;
    const { name, value } = e.target;
    setVacante({ ...vacante, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacante) return;
    setSaving(true);

    const res = await fetch(`/api/Ofertas/${vacante.id_ofertas}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vacante),
    });

    const data = await res.json();
    setSaving(false);

    if (data.ok) {
      alert("Vacante actualizada. Se enviará a revisión.");
      router.push("/BolsaTrabajo/VacantesEmpresa");
    } else {
      alert("Error al actualizar la vacante");
    }
  };

  if (loading) return <p className="p-6">Cargando vacante...</p>;
  if (!vacante) return <p className="p-6">No se encontró la vacante.</p>;

  return (
    <section className="container mx-auto px-5 py-16">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Vacante</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 max-w-2xl mx-auto space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            name="titulo"
            value={vacante.titulo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Puesto</label>
          <input
            type="text"
            name="puesto"
            value={vacante.puesto}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            value={vacante.ubicacion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="descripcion"
            value={vacante.descripcion}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">URL de Imagen</label>
          <input
            type="text"
            name="imagen"
            value={vacante.imagen}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Cierre</label>
          <input
            type="date"
            name="fecha_cierre"
            value={vacante.fecha_cierre.split("T")[0]}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/BolsaTrabajo/VacantesEmpresa")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </section>
  );
}
