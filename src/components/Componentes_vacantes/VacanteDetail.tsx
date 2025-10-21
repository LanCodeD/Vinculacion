// src/components/Componentes_vacantes/VacanteDetail.tsx
"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface VacanteDetailProps {
  id: number;
  titulo: string;
  puesto?: string | null;
  descripcion?: string | null;
  imagen?: string | null;
  ubicacion?: string | null;
}

const VacanteDetail: React.FC<VacanteDetailProps> = ({
  id,
  titulo,
  puesto,
  descripcion,
  imagen,
  ubicacion,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function handleAplicar() {
    if (!session?.user) {
      alert("Debes iniciar sesión para postularte.");
      router.push("/IniciarSesion");
      return;
    }

    try {
      setLoading(true);
      setMensaje("");

      const res = await fetch("/api/Postulaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ofertaId: id,
          usuarioId: session.user.id,
          mensaje: "Estoy interesado en esta vacante.",
        }),
      });

      const data = await res.json();

      if (!data.ok) throw new Error(data.error || "Error al postular.");

      setMensaje("✅ Te has postulado correctamente.");
    } catch (err: any) {
      setMensaje(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <button
          onClick={() => router.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 focus:outline-none hover:bg-blue-600"
        >
          Regresar
        </button>

        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <img
            alt={titulo}
            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
            src={imagen ?? "https://dummyimage.com/720x400"}
          />

          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              Vacante
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {puesto ?? "Sin puesto especificado"}
            </h1>

            <p className="leading-relaxed mb-4">
              {descripcion ?? "Sin descripción disponible"}
            </p>

            {ubicacion && (
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Ubicación:</span> {ubicacion}
              </p>
            )}

            <button
              onClick={handleAplicar}
              disabled={loading}
              className="flex mt-6 text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Aplicar"}
            </button>

            {mensaje && <p className="mt-3 text-sm">{mensaje}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VacanteDetail;
