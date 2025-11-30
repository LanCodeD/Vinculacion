"use client";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const res = await fetch("/api/OlvidarContrase/olvidar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      if (res.ok) {
        setMensaje(
          "Si tu correo está registrado, recibirás un enlace de recuperación."
        );
      } else {
        setMensaje("Hubo un error al procesar la solicitud.");
      }
    } catch {
      setMensaje("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-black flex items-center justify-center bg-linear-to-br from-sky-600 via-gray-50 to-cyan-500">
      <form
        onSubmit={handleForgotPassword}
        className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl p-8 space-y-6 border border-white/30 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Recuperar contraseña
        </h2>
        <p className="text-center text-sm text-gray-500">
          Ingresa tu correo para recibir un enlace de recuperación
        </p>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Correo</label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold shadow-md transition-all
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>

        {mensaje && (
          <p className="text-center text-sm text-gray-600 mt-3">{mensaje}</p>
        )}

        {/* 🔙 Botón de navegación */}
        <div className="text-center mt-4">
          <Link
            href="/IniciarSesion"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
