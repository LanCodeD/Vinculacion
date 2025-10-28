// src/app/%28dashboard%29/BolsaTrabajo/EditarVacantes/%5Bid%5D/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Vacante {
  id_ofertas: number;
  titulo: string;
  descripcion_general: string;
  requisitos: string;
  horario: string;
  modalidad: string;
  puesto: string;
  ubicacion: string;
  imagen: string;
  fecha_cierre: string;
  ingenierias_ofertas: {
    academia: { id_academias: number; ingenieria: string }[];
  }
}

export default function EditarVacantePage() {
  const params = useParams();
  const router = useRouter();
  const [vacante, setVacante] = useState<Vacante | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [ingenierias, setIngenierias] = useState<number[]>([]);
  const [listaIngenierias, setListaIngenierias] = useState<
    { id_academias: number; ingenieria: string }[]
  >([]);

  const id = params.id;

  useEffect(() => {
    // 🔹 Cargar ingenierías desde backend
    fetch("/api/Ingenierias")
      .then(res => res.json())
      .then(data => {
        if (data.ok) setListaIngenierias(data.ingenierias);
      })
      .catch(err => console.error(err));

    if (!id) return;

    // 🔹 Obtener la vacante actual
    fetch(`/api/Ofertas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setVacante(data.vacante);
          // 🔹 Asignar academias seleccionadas de la vacante
          if (data.vacante.ingenierias_ofertas) {
            setIngenierias(
              data.vacante.ingenierias_ofertas.map(
                (c: any) => c.academia.id_academias
              )
            );
          }

        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!vacante) return;
    const { name, value } = e.target;
    setVacante({ ...vacante, [name]: value });
  };

  const handleIngenieriaChange = (idIng: number, checked: boolean) => {
    if (checked) {
      setIngenierias([...ingenierias, idIng]);
    } else {
      setIngenierias(ingenierias.filter((id) => id !== idIng));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacante) return;

    if (ingenierias.length === 0) {
      alert("Selecciona al menos una ingeniería.");
      return;
    }

    setSaving(true);

    // 🔹 Enviamos la vacante con las categorías seleccionadas
    const body = {
      ...vacante,
      ingenierias, // <- incluimos las categorías
    };

    const res = await fetch(`/api/Ofertas/${vacante.id_ofertas}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Editar Vacante
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 max-w-2xl mx-auto space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre de la empresa
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Puesto
          </label>
          <input
            type="text"
            name="puesto"
            value={vacante.puesto}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ubicación del puesto
          </label>
          <input
            type="text"
            name="ubicacion"
            value={vacante.ubicacion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="descripcion_general"
            value={vacante.descripcion_general}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Requisitos
          </label>
          <textarea
            name="requisitos"
            value={vacante.requisitos}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Horario
          </label>
          <textarea
            name="horario"
            value={vacante.horario}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Modalidad
          </label>
          <textarea
            name="modalidad"
            value={vacante.modalidad}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700">
            URL de Imagen
          </label>
          <input
            type="text"
            name="imagen"
            value={vacante.imagen}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Cierre
          </label>
          <input
            type="date"
            name="fecha_cierre"
            value={vacante.fecha_cierre.split("T")[0]}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        {/* 🔹 NUEVO: Selector de categorías */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingenierías Asociadas
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {listaIngenierias.map((ing) => (
              <label key={ing.id_academias} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ingenierias.includes(ing.id_academias)}
                  onChange={(e) =>
                    handleIngenieriaChange(ing.id_academias, e.target.checked)
                  }
                />
                <span>{ing.ingenieria}</span>
              </label>
            ))}
          </div>
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
