"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Notificacion {
  id_notificaciones: number;
  titulo: string;
  mensaje: string;
  leido: boolean;
  metadata?: { vacanteId?: number; postulacionId?: number };
  creado_en: string;
}

export default function NotificacionesPage() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const skipRef = useRef(0);
  const take = 20; // cantidad por página

  const fetchNotificaciones = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/Notificaciones?skip=${skipRef.current}&take=${take}`
      );
      const data = await res.json();
      if (data.ok) {
        if (data.notificaciones.length < take) setHasMore(false);
        setNotificaciones((prev) => [...prev, ...data.notificaciones]);
        skipRef.current += data.notificaciones.length;
      }
    } catch (error) {
      console.error("Error al cargar notificaciones", error);
    } finally {
      setLoading(false);
    }
  }, [hasMore, take]); 

  const marcarLeida = async (id: number) => {
    try {
      await fetch(`/api/Notificaciones/leer/${id}`, { method: "PATCH" });
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id_notificaciones === id ? { ...n, leido: true } : n
        )
      );
    } catch (error) {
      console.error("Error al marcar como leída", error);
    }
  };

  const marcarTodasLeidas = async () => {
    try {
      await fetch("/api/Notificaciones/leer", { method: "PATCH" });
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })));
    } catch (error) {
      console.error("Error al marcar todas como leídas", error);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
  }, [fetchNotificaciones]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastNotificacionRef = useCallback(
    (node: HTMLLIElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchNotificaciones();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchNotificaciones] 
  );

  const handleClickNotificacion = (n: Notificacion) => {
    marcarLeida(n.id_notificaciones);

    const url = n.metadata?.vacanteId
      ? `/Admin/BolsaTrabajoAD/${n.metadata.vacanteId}`
      : n.metadata?.postulacionId
      ? `/BolsaTrabajo/Postulaciones/${n.metadata.postulacionId}`
      : undefined;

    if (url) router.push(url);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()} 
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          ← Regresar
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Notificaciones</h1>
        <button
          onClick={marcarTodasLeidas}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Marcar todas como leídas
        </button>
      </div>

      {notificaciones.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No tienes notificaciones
        </p>
      ) : (
        <ul className="space-y-3">
          {notificaciones.map((n, index) => {
            const isLast = index === notificaciones.length - 1;
            return (
              <li
                key={`${n.id_notificaciones}-${index}`}
                ref={isLast ? lastNotificacionRef : null}
                className={`bg-gray-50 rounded-lg p-4 flex justify-between items-start transition hover:bg-gray-100 shadow-sm`}
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{n.titulo}</p>
                  <p className="text-gray-600 text-sm mt-1">{n.mensaje}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    {new Date(n.creado_en).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  {!n.leido && <FaCircle className="text-red-500 mt-1" />}
                  <button
                    onClick={() => handleClickNotificacion(n)}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                  >
                    Ver detalles
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {loading && (
        <p className="text-center mt-6 text-gray-500">Cargando más...</p>
      )}
      {!hasMore && notificaciones.length > 0 && (
        <p className="text-center mt-6 text-gray-400">
          No hay más notificaciones
        </p>
      )}
    </div>
  );
}
