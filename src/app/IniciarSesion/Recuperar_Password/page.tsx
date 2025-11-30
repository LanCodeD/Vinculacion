"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const res = await fetch("/api/OlvidarContrase/restablecer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (res.ok) {
        setMensaje("Contraseña actualizada con éxito. Ya puedes iniciar sesión.");
      } else {
        const data = await res.json();
        setMensaje(data.error || "Error al actualizar la contraseña.");
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
        onSubmit={handleResetPassword}
        className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl p-8 space-y-6 border border-white/30 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Restablecer contraseña
        </h2>
        <p className="text-center text-sm text-gray-500">
          Ingresa tu nueva contraseña
        </p>

        {/* 🔒 Input con toggle de visibilidad */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold shadow-md transition-all"
        >
          {loading ? "Actualizando..." : "Actualizar contraseña"}
        </button>

        {mensaje && (
          <p className="text-center text-sm text-gray-600 mt-3">{mensaje}</p>
        )}

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
