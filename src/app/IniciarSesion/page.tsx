"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import BotonGoogle from "../Registro/Pasos/BotonGoogle";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 nuevo estado
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(decodeURIComponent(error), { position: "top-right" });
      router.replace("/IniciarSesion");
    }
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      correo,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error(res.error, { position: "top-right" });
    } else {
      toast.success("Login correcto 🎉", {
        position: "top-right",
        duration: 1500,
      });
      const session = await getSession();
      const role = session?.user.role;

      setTimeout(() => {
        if (role === "Administrador") {
          router.push("../Admin/ConfiguracionAdmin");
        } else {
          router.push("/MenuPrincipal");
        }
      }, 1600);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-600 via-gray-50 to-cyan-500 text-black">
      <Toaster />
      <div className="relative w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-r from-yellow-100 to-yellow-100 rounded-3xl blur opacity-60 animate-pulse pointer-events-none z-0"></div>

          <form
            onSubmit={handleLogin}
            className="relative z-10 bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl p-8 space-y-6 border border-white/30"
          >
            <h2 className="text-3xl font-extrabold text-center text-gray-800 drop-shadow-sm">
              Bienvenido Gavilán
            </h2>
            <p className="text-center text-sm text-gray-500">
              Ingresa tus credenciales para continuar
            </p>

            {/* 📧 Correo */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Correo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  {/* ícono correo */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21.75 7.5l-9.573 6.382a.75.75 0 01-.854 0L1.75 7.5M3 5.25h18a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* 🔒 Contraseña con toggle */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  {/* ícono candado */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16.5 10.5V7.875a4.875 4.875 0 00-9.75 0V10.5m12 0a2.25 2.25 0 012.25 2.25v6.75a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25v-6.75A2.25 2.25 0 014.5 10.5m12 0h-12"
                    />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* 🔘 Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            {/* 🧩 Opcional: enlace de recuperación */}
            <p className="text-center text-sm text-gray-500 mt-3">
              ¿Olvidaste tu contraseña?{" "}
              <Link
                href="/IniciarSesion/Olvidar_Password"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Recuperar
              </Link>
            </p>
          </form>
        </div>
        <div className="mt-4 px-8">
          <BotonGoogle texto="Iniciar sesión con Google" modo="login" />
        </div>
      </div>
    </div>
  );
}
