"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface VacanteDetailProps {
  id: number;
  titulo: string;
  puesto?: string | null;
  descripcion?: string | null;
  imagen?: string | null;
  ubicacion?: string | null;
}

export default function VacanteDetail({
  id,
  titulo,
  puesto,
  descripcion,
  imagen,
  ubicacion,
}: VacanteDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvChecking, setCvChecking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"descripcion" | "info" | "detalles">("descripcion");

  // Util: comprueba si una URL responde (HEAD -> fallback GET)
  async function urlExists(url: string, signal?: AbortSignal): Promise<boolean> {
    try {
      // Intentamos HEAD primero (más ligero)
      const headRes = await fetch(url, { method: "HEAD", signal });
      if (headRes.ok) return true;

      // Si HEAD no responde OK (algunos servidores no permiten HEAD), intentamos GET
      const getRes = await fetch(url, { method: "GET", signal });
      return getRes.ok;
    } catch (err) {
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
        const res = await fetch(`/api/Users/${session.user.id}?t=${Date.now()}`, { signal });
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
          console.warn("CV URL encontrada pero recurso no disponible (404 o CORS).");
          setCvUrl(null);
        }
      } catch (err) {
        if ((err as any)?.name === "AbortError") {
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
      alert("Debes iniciar sesión para postularte.");
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
    <section className="text-gray-700 body-font overflow-hidden">
      <div className="container px-5 py-16 mx-auto">
        <button
          onClick={() => router.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-6 hover:bg-blue-600"
        >
          ← Regresar
        </button>

        <div className="lg:w-4/5 mx-auto flex flex-wrap items-start">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-8 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest uppercase">Vacante</h2>
            <h1 className="text-gray-900 text-3xl title-font font-bold mb-4">
              {puesto ?? "Sin puesto especificado"}
            </h1>

            <div className="flex mb-6 border-b border-gray-300">
              {["descripcion", "info", "detalles"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-2 text-lg font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab
                      ? "text-indigo-600 border-indigo-600"
                      : "text-gray-500 border-transparent hover:text-indigo-500"
                  }`}
                >
                  {tab === "descripcion" ? "Descripción" : tab === "info" ? "Información" : "Detalles"}
                </button>
              ))}
            </div>

            {activeTab === "descripcion" && (
              <p className="leading-relaxed mb-6">{descripcion ?? "Sin descripción disponible."}</p>
            )}
            {activeTab === "info" && (
              <div className="space-y-2 mb-6">
                <p><span className="font-semibold">Ubicación:</span> {ubicacion ?? "No especificada"}</p>
                <p><span className="font-semibold">Título:</span> {titulo}</p>
                <p><span className="font-semibold">ID de Vacante:</span> {id}</p>
              </div>
            )}
            {activeTab === "detalles" && (
              <div className="space-y-2 mb-6">
                <p>🕒 Jornada: Tiempo completo</p>
                <p>💼 Modalidad: Presencial</p>
                <p>📅 Publicada recientemente</p>
              </div>
            )}

            {/* Sección CV con verificación */}
            <div className="border-t border-b py-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Currículum Vitae (CV)</h3>

              {cvChecking ? (
                <p className="text-sm text-gray-600">Verificando CV en tu perfil...</p>
              ) : cvUrl ? (
                <a href={cvUrl} target="_blank" rel="noreferrer" className="text-indigo-600 underline">
                  📄 Ver mi CV
                </a>
              ) : (
                <p className="text-red-500 text-sm">
                  ⚠️ No tienes un CV cargado (o el archivo no está accesible). Sube uno en tu{" "}
                  <a href="/MenuPrincipal/ConfiPerfil" className="text-indigo-600 underline">perfil</a>{" "}
                  para poder postularte.
                </p>
              )}
            </div>

            <button
              onClick={handleAplicar}
              disabled={loading || !cvUrl}
              className={`w-full text-white py-2 px-6 rounded transition-all ${
                loading ? "bg-indigo-300" : !cvUrl ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {loading ? "Enviando..." : "Postularse"}
            </button>

            {mensaje && <p className="mt-4 text-sm text-gray-700">{mensaje}</p>}
          </div>

          <img
            alt={titulo}
            className="lg:w-1/2 w-full h-[400px] object-cover object-center rounded shadow"
            src={imagen ?? "https://dummyimage.com/400x400"}
          />
        </div>
      </div>
    </section>
  );
}
