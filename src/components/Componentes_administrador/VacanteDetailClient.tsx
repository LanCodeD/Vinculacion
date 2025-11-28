"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

type VacanteDetail = {
  id_ofertas: number;
  titulo: string;
  puesto: string | null;
  ubicacion?: string | null;
  descripcion_general: string | null;
  requisitos: string | null;
  horario: string | null;
  modalidad: string | null;
  imagen?: string | null;
  fecha_publicacion?: Date | null;
  fecha_cierre?: Date | null;
  creado_en?: Date;
  actualizado_en?: Date;
  empresas: { nombre_comercial: string };
  oferta_estados_id: number;
  estado: { id_oferta_estados: number; nombre_estado: string };
  ingenierias_ofertas: { academia: { ingenieria: string } }[];
};

interface Props {
  vacante: VacanteDetail;
}

export default function AdminVacanteDetailClient({ vacante }: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formatFecha = (fecha: string | Date) => {
    if (!fecha) return "";

    const f = new Date(fecha);

    // Asegurar que se use la fecha UTC sin aplicar ajuste de zona
    return f.toISOString().slice(0, 10); // "YYYY-MM-DD"
  };


  const handleAction = async (accion: "aprobar" | "rechazar") => {
    if (!session?.user) return;

    setLoading(true);
    const toastId = toast.loading(
      `${accion === "aprobar" ? "Publicando" : "Rechazando"} vacante...`
    );

    try {
      const res = await fetch(`/api/Ofertas/${vacante.id_ofertas}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        toast.success(
          `Vacante ${accion === "aprobar" ? "aprobada y publicada" : "rechazada"
          } correctamente.`,
          { id: toastId }
        );
        router.push("/Admin/BolsaTrabajoAD");
      } else {
        toast.error(
          "Error al actualizar la vacante: " + (data.error ?? "Desconocido"),
          { id: toastId }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Error en la conexión con el servidor", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md mt-6">
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "bg-white shadow-lg border border-gray-200 text-gray-800 rounded-xl px-4 py-3",
          duration: 4000,
          success: { iconTheme: { primary: "#16a34a", secondary: "white" } },
          error: { iconTheme: { primary: "#dc2626", secondary: "white" } },
        }}
      />

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Regresar
        </button>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${vacante.oferta_estados_id === 3
            ? "bg-green-100 text-green-800 border border-green-300"
            : vacante.oferta_estados_id === 4
              ? "bg-red-100 text-red-800 border border-red-300"
              : vacante.oferta_estados_id === 2
                ? "bg-blue-100 text-blue-800 border border-blue-300"
                : "bg-gray-100 text-gray-800 border border-gray-300"
            }`}
        >
          {vacante.estado.nombre_estado}
        </span>


      </div>

      {/* Contenido principal en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda: información */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{vacante.titulo}</h1>
          <p className="text-gray-700 mb-4">
            <strong>Empresa:</strong> {vacante.empresas.nombre_comercial}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Puesto:</strong> {vacante.puesto ?? "Sin puesto"}</p>
            <p><strong>Ubicación:</strong> {vacante.ubicacion ?? "Sin ubicación"}</p>
            <p><strong>Modalidad:</strong> {vacante.modalidad ?? "Sin modalidad"}</p>
            <p><strong>Horario:</strong> {vacante.horario ?? "Sin horario"}</p>
            <p>
              <strong>Ingenierías:</strong>{" "}
              {vacante.ingenierias_ofertas?.length
                ? vacante.ingenierias_ofertas
                  .map((c) => c.academia.ingenieria)
                  .join(", ")
                : "Ninguna"}
            </p>
          </div>

          {/* Descripción */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Descripción
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {vacante.descripcion_general ?? "Sin descripción"}
            </p>
          </div>

          {/* Requisitos */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Requisitos
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {vacante.requisitos ?? "Sin requisitos"}
            </p>
          </div>

          {/* Fechas */}
          <div className="mt-6 text-sm text-gray-600">
            <p>
              <strong>Fecha de publicación:</strong>{" "}
              {vacante.fecha_publicacion
                ? formatFecha(vacante.fecha_publicacion)
                : "No publicada"}
            </p>
            <p>
              <strong>Fecha de cierre:</strong>{" "}
              {vacante.fecha_cierre
                ? formatFecha(vacante.fecha_cierre)
                : "No definida"}
            </p>
            <p>
              <strong>Última actualización:</strong>{" "}
              {vacante.actualizado_en
                ? formatFecha(vacante.actualizado_en)
                : "N/A"}
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-4 mt-8">
            <button
              disabled={loading}
              onClick={() => handleAction("rechazar")}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
            >
              Rechazar
            </button>
            <button
              disabled={loading}
              onClick={() => handleAction("aprobar")}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
              Aprobar
            </button>
          </div>
        </div>

        {/* Columna derecha: imagen */}
        <div className="flex justify-center items-start">
          {vacante.imagen ? (
            <Image
              unoptimized
              src={vacante.imagen}
              alt={vacante.titulo}
              width={500}
              height={400}
              className="rounded-xl shadow-md object-cover max-h-[400px] w-full"
              priority
            />
          ) : (
            <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center rounded-xl text-gray-400 border">
              Sin imagen disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
