"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type VacanteDetail = {
  id_ofertas: number;
  titulo: string;
  puesto: string | null;
  empresas: { nombre_comercial: string };
  estado: { nombre_estado: string };
};

interface Props {
  vacante: VacanteDetail;
}

export default function AdminVacanteDetailClient({ vacante }: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (accion: "aprobar" | "rechazar") => {
    if (!session?.user) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/Ofertas/${vacante.id_ofertas}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        alert(`Vacante ${accion === "aprobar" ? "publicada" : "rechazada"} correctamente.`);
        router.push("/Admin/BolsaTrabajo");
      } else {
        alert("Error al actualizar la vacante: " + (data.error ?? "Desconocido"));
      }
    } catch (error) {
      console.error(error);
      alert("Error en la conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="bg-gray-300 px-3 py-1 rounded mb-4 hover:bg-gray-400"
      >
        ← Regresar
      </button>

      <h1 className="text-3xl font-bold mb-4">{vacante.titulo}</h1>
      <p>Empresa: {vacante.empresas.nombre_comercial}</p>
      <p>Estado: {vacante.estado.nombre_estado}</p>
      <p>Puesto: {vacante.puesto ?? "Sin puesto"}</p>

      <div className="flex gap-4 mt-6">
        <button
          disabled={loading}
          onClick={() => handleAction("aprobar")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Aprobar / Publicar
        </button>

        <button
          disabled={loading}
          onClick={() => handleAction("rechazar")}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
