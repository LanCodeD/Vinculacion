"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";


export default function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      correo,
      password,
      redirect: false, // controlamos manualmente
    });

    setLoading(false);

    if (res?.error) {
      toast.error(res.error, {
        position: "top-right",
      });
    } else {
      toast.success("Login correcto 🎉", {
        position: "top-right",
        duration: 1500,
      });
      // 👇 Obtenemos la sesión actual para saber el rol
      const session = await getSession();
      const role = session?.user.role;

      setTimeout(() => {
        if (role === "Administrador") {
          router.push("../Admin/PanelAdmin"); // vista del admin
        } else {
          router.push("/MenuPrincipal"); // vista de usuarios normales
        }
      }, 1600);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      {/* 🔔 Componente global de notificaciones */}
      <Toaster />

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Iniciar Sesión
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="mt-1 block w-full rounded-lg placeholder:text-gray-400 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-lg placeholder:text-gray-400 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
