// src/components/Componentes_administrador/VacanteDetailClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type VacanteDetail = {
  id_ofertas: number;
  titulo: string;
  puesto: string | null;
  ubicacion?: string | null;
  descripcion: string | null;
  imagen?: string | null;
  fecha_publicacion?: Date | null;
  fecha_cierre?: Date | null;
  creado_en?: Date;
  actualizado_en?: Date;
  empresas: { nombre_comercial: string };
  estado: { nombre_estado: string };
  ingenierias_ofertas: { academia: { ingenieria: string } }[];
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
        router.push("/Admin/BolsaTrabajoAD");
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
      {vacante.imagen && (
        <img
          src={vacante.imagen}
          alt={vacante.titulo}
          className="w-full max-h-80 object-cover rounded-lg mb-4 shadow"
        />
      )}
      <p><strong>Titulo:</strong> {vacante.titulo}</p>
      <p><strong>Empresa:</strong> {vacante.empresas.nombre_comercial}</p>
      <p><strong>Estado:</strong> {vacante.estado.nombre_estado}</p>
      <p><strong>Puesto:</strong> {vacante.puesto ?? "Sin puesto"}</p>

      <p>
        <strong>Ingenierías:</strong>{" "}
        {vacante.ingenierias_ofertas && vacante.ingenierias_ofertas.length > 0
          ? vacante.ingenierias_ofertas.map(c => c.academia.ingenieria).join(", ")
          : "Sin ingenierías"}
      </p>

      <p><strong>Ubicación:</strong> {vacante.ubicacion ?? "Sin ubicación"}</p>
      <p><strong>Descripción:</strong> {vacante.descripcion ?? "Sin descripción"}</p>
      <p><strong>ID de la Vacante:</strong> {vacante.id_ofertas}</p>

      <p><strong>Fecha de publicación:</strong> {vacante.fecha_publicacion ? new Date(vacante.fecha_publicacion).toLocaleDateString() : "No publicada"}</p>
      <p><strong>Fecha de cierre:</strong> {vacante.fecha_cierre ? new Date(vacante.fecha_cierre).toLocaleDateString() : "No definida"}</p>
      <p><strong>Creada el:</strong> {vacante.creado_en ? new Date(vacante.creado_en).toLocaleDateString() : "N/A"}</p>
      <p><strong>Última actualización:</strong> {vacante.actualizado_en ? new Date(vacante.actualizado_en).toLocaleDateString() : "N/A"}</p>


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
