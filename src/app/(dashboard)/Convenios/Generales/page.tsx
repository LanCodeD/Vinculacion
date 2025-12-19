// app/dashboard/Convenios/Generales/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import type { AxiosError } from "axios";

export default function ConveniosGeneralesInicio() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const crearSolicitud = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/Convenios/Generales", {
        tipo_solicitud_id: 1,
      });
      router.push(`/Convenios/Generales/${data.id_solicitud}/TipoConvenio`);
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      const mensaje = error.response?.data?.error || "Error al crear solicitud";
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white px-6 text-center">
      <Toaster position="top-right" />
      <div className="max-w-2xl w-full space-y-8">
        {/* Encabezado */}
        <h1 className="text-4xl font-extrabold text-[#011848] tracking-tight">
          Solicitud de Convenio General
        </h1>

        {/* Descripción */}
        <p className="text-gray-700 text-base leading-relaxed">
          En esta sección podrás crear una nueva solicitud de convenio general.
          Completa los pasos requeridos y guarda tu progreso en cada sección.
        </p>

        {/* Imagen */}
        <div className="overflow-hidden rounded-xl shadow-lg">
          <Image
            src="/Convenios/convenio2.webp"
            alt="Imagen ilustrativa de convenio general"
            width={600}
            height={400}
            className="w-full h-auto object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        {/* Botón */}
        <button
          onClick={crearSolicitud}
          disabled={loading}
          className={`mt-4 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-md ${
            loading
              ? "bg-gray-400 cursor-not-allowed animate-pulse"
              : "bg-[#53b431] hover:bg-[#459b28] hover:scale-[1.02]"
          }`}
        >
          {loading ? "Creando solicitud..." : "Empezar solicitud"}
        </button>
      </div>
    </div>
  );
}
