"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "./components/footer";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleIngresar = () => {
    setLoading(true);

    // Simula un delay antes de redirigir (puedes reemplazarlo con tu lógica real)
    setTimeout(() => {
      router.push("/Registro");
    }, 800);
  };
  return (
    <>

      {/* ================= Header ================= */}
      <header className="w-full">
        <nav className="border-gray-200 bg-blue-900 py-2.5">
          <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4">

            {/* Logo e imagen */}
            <a href="#" className="flex items-center space-x-3 relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
                <Image
                  src="/banner/tecnm.webp"
                  alt="Logo"
                  fill
                  className="object-contain scale-125"
                />
              </div>
            </a>

            <div className="flex items-center lg:order-2">
              <a className="rounded-lg border-2 border-white px-4 py-2 text-sm font-medium text-white hover:bg-gray-50 sm:mr-2 lg:px-5 lg:py-2.5" href="/">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </a>
              <a className="rounded-lg border-2 border-white px-4 py-2 text-sm font-medium text-white hover:bg-gray-50 sm:mr-2 lg:px-5 lg:py-2.5" href="/guest">
                Log out
              </a>
            </div>

            <div className="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto" id="mobile-menu-2">
              <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
                <li><a className="block border-b py-2 pr-4 pl-3 text-gray-200 hover:text-white lg:border-0 lg:p-0" href="/">ITSVA</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>


      {/* ================= Hero ================= */}
      <section className="min-h-screen bg-white flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center lg:items-center gap-12 lg:gap-36">

          {/* Texto*/}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="max-w-2xl font-manrope font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-5 leading-snug">
              Sistema de <span className="text-blue-700">convenios y bolsa de trabajo</span>
            </h1>

            <p className="max-w-md mx-auto lg:mx-0 text-base sm:text-lg text-gray-500 mb-8">
              Conoce más sobre nuestros servicios y oportunidades.
            </p>

            {/* ================= Botón con animación de carga ================= */}
            <button
              onClick={handleIngresar}
              disabled={loading}
              className={`inline-flex items-center justify-center py-3 px-7 text-base font-semibold text-white rounded-full bg-blue-700 shadow-lg
              hover:bg-blue-700 hover:-translate-y-1 hover:scale-110
              transition-transform duration-300 ease-in-out
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  {/* Spinner */}
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                    ></path>
                  </svg>
                  Cargando...
                </>
              ) : (
                <>
                  Ingresar
                  <svg
                    className="ml-2"
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </motion.div>

          {/* Imagen */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end mb-8 lg:mb-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            <Image
              src="/banner/estrecho.webp"
              alt="Banner convenios y bolsa de trabajo"
              width={600}
              height={400}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-lg"
            />
          </motion.div>

        </div>

        {/* Flecha para scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <a href="#convenios">
            <svg
              className="w-8 h-8 text-indigo-600 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </section>


      {/* ================= Secciones adicionales ================= */}
      <section id="convenios" className="bg-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Convenios</h2>
          <div className="flex justify-center mb-4">
            <p className="text-gray-700 mb-8">
              Solicitudes.
            </p>
          </div>

        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Bolsa de trabajo</h2>
          <p className="text-gray-700 mb-8">
            Postulaciones.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Nosotros</h2>
          <p className="text-gray-700 mb-8">
            Somos un área dedicada a la gestion de convenios y oportunidades laborales.
          </p>
        </div>
      </section>

      {/* ================= Footer ================= */}
      <Footer />
    </>
  );
}