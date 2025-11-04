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
      const { data } = await axios.post("/api/Convenios/Especificos", {
        tipo_solicitud_id: 2,
      });
      router.push(`/Convenios/Especificos/${data.id_solicitud}/TipoConvenio`);
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      const mensaje = error.response?.data?.error || "Error al crear solicitud";
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <Toaster position="top-right" />
      <div className="max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-[#011848]">
          Solicitud de Convenio Específico
        </h1>
        <p className="text-gray-600">
          En esta sección podrás crear una nueva solicitud de convenio
          específico. Completa los pasos requeridos y guarda tu progreso en cada
          sección.
        </p>
        <Image
          src="/Convenios/convenio2.webp"
          alt="imagen"
          width={600}
          height={400}
          className="rounded-xl shadow-md w-full h-auto object-cover"
        />
        <button
          onClick={crearSolicitud}
          disabled={loading}
          className="mt-6 px-8 py-3 rounded-xl bg-[#53b431] text-white font-medium hover:bg-[#459b28] transition"
        >
          {loading ? "Creando solicitud..." : "Empezar solicitud"}
        </button>
      </div>
    </div>
  );
}
