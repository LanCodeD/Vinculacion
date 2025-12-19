"use client";
import { useEffect, useState } from "react";
import VacanteCardEmpresa from "./VacanteCardEmpresa";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface Vacante {
  id_ofertas: number;
  titulo: string;
  puesto: string;
  descripcion_general: string;
  imagen: string;
  oferta_estados_id: number;
}

export default function VacantesEmpresaList() {
  const pathname = usePathname();
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar vacantes de la empresa
  useEffect(() => {
    fetch("/api/Ofertas/Empresa")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const vacs = data.vacantes.map((v: Partial<Vacante>) => ({
            id_ofertas: v.id_ofertas!,
            titulo: v.titulo ?? "",
            puesto: v.puesto ?? "Sin puesto especificado",
            descripcion_general:
              v.descripcion_general ?? "Sin descripción disponible",
            imagen: v.imagen ?? "https://dummyimage.com/720x400",
            oferta_estados_id: v.oferta_estados_id ?? 2,
          }));
          setVacantes(vacs);
        }
      })
      .finally(() => setLoading(false));
  }, [pathname]);

  // Confirmación visual + eliminación o cierre
  const eliminarVacante = (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium">¿Seguro que deseas eliminar esta vacante?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                const res = await fetch(`/api/Ofertas/${id}`, {
                  method: "DELETE",
                });
                const data = await res.json();

                if (data.ok) {
                  if (data.cerrada) {
                    toast.success("Vacante marcada como cerrada");
                    // Actualiza el estado visual sin eliminar la card
                    setVacantes((prev) =>
                      prev.map((v) =>
                        v.id_ofertas === id
                          ? { ...v, oferta_estados_id: 5 } // 5 = CERRADA
                          : v
                      )
                    );
                  } else {
                    toast.success("Vacante eliminada correctamente");
                    setVacantes((prev) =>
                      prev.filter((v) => v.id_ofertas !== id)
                    );
                  }
                } else {
                  toast.error(data.error || "Error al eliminar la vacante");
                }
              } finally {
                toast.dismiss(t.id);
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Sí, eliminar
          </button>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    ));
  };

  // Renderizado
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
          onUpdate={(id, nuevoEstado) => {
            setVacantes((prev) =>
              prev.map((v) =>
                v.id_ofertas === id ? { ...v, oferta_estados_id: nuevoEstado } : v
              )
            );
          }}
        />
      ))}
    </div>
  );
}
