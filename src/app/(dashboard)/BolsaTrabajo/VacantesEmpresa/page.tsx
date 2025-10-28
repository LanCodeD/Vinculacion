// src/app/%28dashboard%29/BolsaTrabajo/VacantesEmpresa/page.tsx
"use client";
import { useEffect, useState } from "react";
import VacanteCard from "@/components/Componentes_empresas/VacanteCardEmpresa";

interface Vacante {
  id_ofertas: number;
  titulo: string;
  puesto: string;
  descripcion_general: string;
  imagen: string;
  oferta_estados_id: number;
}

export default function VacantesEmpresa() {
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/Ofertas/Empresa")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setVacantes(data.vacantes);
      })
      .finally(() => setLoading(false));
  }, []);

  const eliminarVacante = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta vacante?")) return;
    const res = await fetch(`/api/Ofertas/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) {
      setVacantes((prev) => prev.filter((v) => v.id_ofertas !== id));
    } else {
      alert("Error al eliminar la vacante");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <section className="text-gray-700 body-font">
      <div className="container px-5 py-24 mx-auto -max-lg:px-0 -mt-15">
        <h1 className="text-2xl font-bold mb-6">Mis Vacantes</h1>

        {/* Grid responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {vacantes.length > 0 ? (
            vacantes.map((v) => (
              <VacanteCard
                key={v.id_ofertas}
                id={v.id_ofertas}
                titulo={v.titulo}
                puesto={v.puesto}
                descripcion_general={v.descripcion_general}
                imagen={v.imagen}
                estado={v.oferta_estados_id}
                showActions
                onDelete={eliminarVacante}
              />
            ))
          ) : (
            <p>No tienes vacantes aún.</p>
          )}
        </div>
      </div>
    </section>
  );
}
