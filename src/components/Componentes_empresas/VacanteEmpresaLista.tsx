// src/components/Componentes_empresas/VacantesEmpresaList.tsx
"use client";
import { useEffect, useState } from "react";
import VacanteCardEmpresa from "./VacanteCardEmpresa";

interface Vacante {
  id_ofertas: number;
  titulo: string;
  puesto: string;
  descripcion_general: string;
  imagen: string;
  oferta_estados_id: number;
}

export default function VacantesEmpresaList() {
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/Ofertas/Empresa")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const vacs = data.vacantes.map((v: any) => ({
            id_ofertas: v.id_ofertas,
            titulo: v.titulo ?? "",
            puesto: v.puesto ?? "Sin puesto especificado",
            descripcion_general: v.descripcion_general ?? "Sin descripción disponible",
            imagen: v.imagen ?? "https://dummyimage.com/720x400",
            oferta_estados_id: v.oferta_estados_id ?? 2,
          }));
          setVacantes(vacs);
        }
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

  if (vacantes.length === 0) return <p>No tienes vacantes aún.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {vacantes.map((v) => (
        <VacanteCardEmpresa
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
      ))}
    </div>
  );
}