"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
//import BotonGoogle from "../Registro/Pasos/BotonGoogle";
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
  <section className="min-h-screen flex overflow-hidden bg-gray-50">
    <Toaster />

    {/* 📷 Imagen lateral (solo en pantallas grandes) */}
    <div className="relative flex-1 hidden lg:block">
      <img
        src="/Dashboard/Ines.png"
        alt="Fondo login"
        className="absolute inset-0 object-cover w-full h-full"
      />
    </div>

    {/* 🧾 Formulario login */}
   <div className="flex flex-col bg-white-50/80 backdrop-blur-sm
justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">

      <div className="w-full max-w-xl mx-auto lg:w-96">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-700">Bienvenido</h2>
          <p className="text-sm text-gray-500">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-6 bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-white/30"
        >
          {/* 📧 Correo */}
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-600">
              Correo electrónico
            </label>
            <div className="mt-1 relative">
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
                id="correo"
                type="email"
                placeholder="ejemplo@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* 🔒 Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <div className="mt-1 relative">
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
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
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
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          {/* 🧩 Recuperar contraseña */}
          <p className="text-center text-sm text-gray-500 mt-3">
            ¿Olvidaste tu contraseña?{" "}
            <Link
              href="/IniciarSesion/Olvidar_Password"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Recuperar
            </Link>
          </p>
        </form>

        {/* 🔹 Separador y Google login opcional */}
{/*         <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-600">O continúa con</span>
          </div>
        </div> */}
        {/* Si quieres habilitar Google login */}
        {/* <BotonGoogle texto="Iniciar sesión con Google" modo="login" /> */}
      </div>
    </div>
  </section>
);

}
