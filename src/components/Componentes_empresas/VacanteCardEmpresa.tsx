"use client";
import { Pencil, Trash, Users, RotateCcw } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

interface VacanteCardProps {
  id: number;
  titulo: string;
  puesto: string;
  descripcion_general: string;
  imagen: string;
  estado?: number;
  showActions?: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, nuevoEstado: number) => void; // 👈 Nuevo prop
}

const estadoEstilos: Record<number, string> = {
  2: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  3: "bg-green-100 text-green-700 border border-green-300",
  4: "bg-red-100 text-red-700 border border-red-300",
  5: "bg-gray-200 text-gray-700 border border-gray-300", // Cerrada
};

const estadoTexto: Record<number, string> = {
  2: "Pendiente de revisión",
  3: "Publicada",
  4: "Rechazada",
  5: "Cerrada",
};

const VacanteCard: React.FC<VacanteCardProps> = ({
  id,
  titulo,
  puesto,
  descripcion_general,
  imagen,
  estado,
  showActions = false,
  onDelete,
  onUpdate,
}) => {
  const reabrirVacante = async () => {
    try {
      const res = await fetch(`/api/Ofertas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevoEstado: 3 }), // 3 = PUBLICADA
      });
      const data = await res.json();

      if (data.ok) {
        toast.success("Vacante reabierta correctamente ✅");
        onUpdate?.(id, 3); // 🔁 Actualiza estado visual
      } else {
        toast.error(data.error || "Error al reabrir la vacante ❌");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error de conexión al reabrir ❌");
    }
  };

  return (
    <div className="p-4">
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700",
        }}
      />
      <div className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-full">
        {/* Imagen */}
        <Image
          unoptimized
          src={imagen}
          alt="Imagen de la vacante"
          width={800}
          height={176}
          className="h-44 rounded-lg w-full object-cover object-center mb-4"
          priority
        />

        {/* Contenido */}
        <div>
          <h3 className="text-sm text-blue-600 font-semibold">{titulo}</h3>
          <h2 className="text-lg text-gray-900 font-medium title-font mb-2">
            {puesto}
          </h2>
          <p className="leading-relaxed text-sm text-gray-600 line-clamp-3">
            {descripcion_general}
          </p>
        </div>

        {/* Estado de la oferta */}
        {estado && (
          <div
            className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-medium text-center self-start ${estadoEstilos[estado]}`}
          >
            {estadoTexto[estado]}
          </div>
        )}

        {/* Acciones */}
        {showActions && (
          <div className="mt-4 flex justify-center gap-3">
            {estado !== 5 && ( // Solo mostrar editar/eliminar si NO está cerrada
              <>
                <Link
                  href={`/BolsaTrabajo/EditarVacantes/${id}`}
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Editar vacante"
                >
                  <Pencil size={18} />
                </Link>
                <button
                  onClick={() => onDelete?.(id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Eliminar vacante"
                >
                  <Trash size={18} />
                </button>
              </>
            )}

            {/* Reabrir vacante */}
            {estado === 5 && (
              <button
                onClick={reabrirVacante}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                title="Reabrir vacante"
              >
                <RotateCcw size={18} />
              </button>
            )}

            {/* Ver postulaciones */}
            <Link
              href={`/BolsaTrabajo/Postulaciones/${id}`}
              className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
              title="Ver postulaciones"
            >
              <Users size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacanteCard;
