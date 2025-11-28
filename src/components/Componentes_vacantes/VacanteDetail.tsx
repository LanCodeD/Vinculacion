"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";

interface VacanteDetailProps {
  id: number;
  titulo: string;
  puesto?: string | null;
  descripcion?: string | null;
  requisitos?: string | null;
  horario?: string | null;
  modalidad?: string | null;
  imagen?: string | null;
  ubicacion?: string | null;
  fecha_cierre?: string | null;
}

export default function VacanteDetail({
  id,
  titulo,
  puesto,
  descripcion,
  requisitos,
  horario,
  modalidad,
  imagen,
  ubicacion,
  fecha_cierre,
}: VacanteDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvChecking, setCvChecking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "descripcion" | "requisitos" | "detalles"
  >("descripcion");

  // Util: comprueba si una URL responde (HEAD -> fallback GET)
  async function urlExists(
    url: string,
    signal?: AbortSignal
  ): Promise<boolean> {
    try {
      // Intentamos HEAD primero (más ligero)
      const headRes = await fetch(url, { method: "HEAD", signal });
      if (headRes.ok) return true;

      // Si HEAD no responde OK (algunos servidores no permiten HEAD), intentamos GET
      const getRes = await fetch(url, { method: "GET", signal });
      return getRes.ok;
    } catch {
      // Puede fallar por CORS o network — lo tratamos como no existente
      return false;
    }
  }

  // Obtener CV del usuario y verificar su existencia real
  useEffect(() => {
    if (!session?.user?.id) {
      setCvUrl(null);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    let mounted = true;

    const fetchAndVerify = async () => {
      setCvChecking(true);
      setCvUrl(null); // evitamos flash mostrando enlace previo hasta verificar

      try {
        // Bust cache: añadimos timestamp para asegurarnos datos frescos
        const res = await fetch(
          `/api/Users/${session.user.id}?t=${Date.now()}`,
          { signal }
        );
        if (!res.ok) {
          console.error("Error API Users:", res.status);
          if (!mounted) return;
          setCvChecking(false);
          setCvUrl(null);
          return;
        }

        const data = await res.json();

        const possibleUrl =
          data?.rol === "Egresado" && data?.egresados?.[0]?.cv_url
            ? data.egresados[0].cv_url
            : null;

        if (!possibleUrl) {
          if (!mounted) return;
          setCvChecking(false);
          setCvUrl(null);
          return;
        }

        // Validamos que la URL realmente responde (no apunte a recurso borrado)
        const exists = await urlExists(possibleUrl, signal);

        if (!mounted) return;

        if (exists) setCvUrl(possibleUrl);
        else {
          console.warn(
            "CV URL encontrada pero recurso no disponible (404 o CORS)."
          );
          setCvUrl(null);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // petición cancelada, no hacer nada
        } else {
          console.error("Error comprobando CV:", err);
          setCvUrl(null);
        }
      } finally {
        if (mounted) setCvChecking(false);
      }
    };

    fetchAndVerify();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [session]);

  // Función para postularse
  async function handleAplicar() {
    if (!session?.user) {
      toast("Debes iniciar sesión para postularte.");
      router.push("/IniciarSesion");
      return;
    }

    if (!cvUrl) {
      setMensaje("⚠️ Necesitas subir tu CV en tu perfil antes de postularte.");
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
        }),
      });

      const data = await res.json();

      if (!data.ok) throw new Error(data.error || "Error al postular.");

      toast.success("✅ Te has postulado correctamente.");
    } catch (err: unknown) {
      const mensaje =
        err instanceof Error ? err.message : "Error inesperado al postular.";
      toast.success(`${mensaje}`);
    } finally {
      setLoading(false);
    }
  }
  type TabKey = "descripcion" | "requisitos" | "detalles";

  return (
    <section className="text-gray-700 body-font overflow-hidden relative">
      <div className="container px-5 py-16 mx-auto relative">
        {/* Botón regresar con ícono */}
        <button
          onClick={() => router.back()}
          title="Regresar"
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          {/* Ícono de flecha */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span className="hidden sm:inline font-medium">Regresar</span>
        </button>

        {/* Contenido principal */}
        <div className="lg:w-4/5 mx-auto flex flex-wrap items-start mt-2.5">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-8 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest uppercase">
              {titulo}
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-bold mb-4">
              {puesto ?? "Sin puesto especificado"}
            </h1>

            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-300">
              {["descripcion", "requisitos", "detalles"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as TabKey)}
                  className={`flex-1 py-2 text-lg font-medium border-b-2 transition-colors duration-200 ${activeTab === tab
                      ? "text-indigo-600 border-indigo-600"
                      : "text-gray-500 border-transparent hover:text-indigo-500"
                    }`}
                >
                  {tab === "descripcion"
                    ? "Descripción"
                    : tab === "requisitos"
                      ? "Requisitos"
                      : "Detalles"}
                </button>
              ))}
            </div>

            {/* Contenido de tabs */}
            {activeTab === "descripcion" && (
              <p className="leading-relaxed mb-6">
                {descripcion ?? "Sin descripción disponible."}
              </p>
            )}
            {activeTab === "requisitos" && (
              <div className="space-y-2 mb-6">
                <p>
                  <span className="font-semibold">Requisitos:</span>{" "}
                  {requisitos ?? "No especificados"}
                </p>
              </div>
            )}
            {activeTab === "detalles" && (
              <div className="space-y-2 mb-6">
                <p>
                  <span className="font-semibold">Fecha de cierre:</span>{" "}
                  {fecha_cierre
                    ? new Date(fecha_cierre).toLocaleDateString("es-MX")
                    : "No disponible"}
                </p>
                <p>
                  <span className="font-semibold">Ubicación:</span>{" "}
                  {ubicacion ?? "No especificada"}
                </p>
                <p>
                  <span className="font-semibold">Horario:</span>{" "}
                  {horario ?? "No especificado"}
                </p>
                <p>
                  <span className="font-semibold">Modalidad:</span>{" "}
                  {modalidad ?? "No especificada"}
                </p>
              </div>
            )}

            {/* CV */}
            <div className="border-t border-b py-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">
                Currículum Vitae (CV)
              </h3>
              {cvChecking ? (
                <p className="text-sm text-gray-600">
                  Verificando CV en tu perfil...
                </p>
              ) : cvUrl ? (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 underline"
                >
                  📄 Ver mi CV
                </a>
              ) : (
                <p className="text-red-500 text-sm">
                  ⚠️ No tienes un CV cargado. Sube uno en tu{" "}
                  <a
                    href="/MenuPrincipal/ConfiPerfil"
                    className="text-indigo-600 underline"
                  >
                    perfil
                  </a>{" "}
                  para poder postularte.
                </p>
              )}
            </div>

            {/* Botón de postular */}
            <button
              onClick={handleAplicar}
              disabled={loading || !cvUrl}
              className={`w-full text-white py-2 px-6 rounded transition-all ${loading
                  ? "bg-indigo-300"
                  : !cvUrl
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
            >
              {loading ? "Enviando..." : "Postularse"}
            </button>

            {mensaje && <p className="mt-4 text-sm text-gray-700">{mensaje}</p>}
          </div>

          {/* Imagen */}
          <Image
            unoptimized
            src={imagen ?? "https://dummyimage.com/400x400"}
            alt={`Imagen de la vacante ${titulo}`}
            width={800}
            height={400}
            className="lg:w-1/2 w-full h-[400px] object-cover object-center rounded shadow mt-10"
            priority
          />
        </div>
      </div>
    </section>
  );
}
