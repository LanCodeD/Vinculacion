"use client";
import Carousel from "@/components/Carrusel";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/footer";
import Link from "next/link";


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
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4">

            {/* Logo e imagen */}
            <a href="#" className="flex items-center space-x-3 relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
                <Image
                  src="/Banner/tecnm.webp"
                  alt="Logo"
                  priority
                  fill
                  className="object-contain scale-125"
                />
              </div>
            </a>

            <div className="flex items-center lg:order-2">
              <Link className="rounded-lg border-2 border-white px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 sm:mr-2 lg:px-5 lg:py-2.5" href="/IniciarSesion">
                Iniciar sesión
              </Link>
              <Link className="rounded-lg border-2 border-white px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 sm:mr-2 lg:px-5 lg:py-2.5" href="/Registro">
                Regístrate
              </Link>
            </div>

            <div className="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto" id="mobile-menu-2">
              <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
                <li>
                  <Link
                    href="/"
                    className="
      block
      text-gray-100
      font-semibold
      tracking-wide
      text-sm
      md:text-base
      py-2
      px-3
      rounded-md
      transition-all
      duration-300
      hover:text-white
      hover:bg-white/10
      focus:outline-none
      focus:ring-2
      focus:ring-white/30
      lg:p-0
      lg:hover:bg-transparent
    "
                  >
                    INSTITUTO TECNOLÓGICO SUPERIOR DE VALLADOLID
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>


      {/* ================= Hero ================= */}
      <section className="min-h-screen bg-white flex items-center">
        <div className="w-full px-2 sm:px-4 lg:px-6 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 m-24">

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
            <Carousel
              images={[
                "/Banner/estrecho.webp",
                "/Banner/A.webp",
                "/Banner/OIP.webp",
              ]}
              autoSlide={true}
              autoSlideInterval={4000}
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* TEXTO */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="font-sans"
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-blue-700">
                Convenios Institucionales
              </h2>

              <p className="text-gray-700 mb-5 text-lg font-medium leading-relaxed text-justify">
                Los convenios institucionales permiten establecer vínculos formales
                de colaboración entre el Instituto Tecnológico Superior de Valladolid
                y diversas instituciones públicas, privadas y del sector productivo.
              </p>

              <p className="text-gray-700 mb-5 text-lg font-medium leading-relaxed text-justify">
                A través de estos acuerdos se promueven prácticas profesionales,
                servicio social, movilidad académica, investigación conjunta y
                desarrollo de proyectos estratégicos.
              </p>

              <p className="text-gray-700 text-lg font-medium leading-relaxed text-justify">
                Esta plataforma facilita la solicitud, seguimiento y consulta de
                convenios, fortaleciendo la vinculación institucional y el desarrollo
                profesional de nuestra comunidad.
              </p>
            </motion.div>

            {/* IMAGEN */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img
                src="/Convenios/convenio2.webp"
                alt="Convenios institucionales"
                className="rounded-xl shadow-lg max-w-full h-auto"
              />
            </motion.div>

          </div>
        </div>
      </section>

      <section id="bolsa-trabajo" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* IMAGEN */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img
                src="/Dashboard/BolsaTrabajo.webp"
                alt="Bolsa de Trabajo"
                className="rounded-xl shadow-lg max-w-full h-auto"
              />
            </motion.div>

            {/* TEXTO */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="font-sans"
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-blue-700">
                Bolsa de Trabajo Institucional
              </h2>

              <p className="text-gray-700 mb-5 text-lg font-medium leading-relaxed text-justify">
                La Bolsa de Trabajo institucional es una plataforma diseñada para
                fortalecer la vinculación entre el sector productivo y la comunidad
                estudiantil y egresada del Instituto Tecnológico Superior de Valladolid.
              </p>

              <p className="text-gray-700 mb-5 text-lg font-medium leading-relaxed text-justify">
                A través de este sistema, las empresas pueden publicar vacantes
                laborales y perfiles profesionales, mientras que los estudiantes y
                egresados tienen la oportunidad de postularse de manera directa,
                segura y organizada.
              </p>

              <p className="text-gray-700 text-lg font-medium leading-relaxed text-justify">
                La plataforma permite dar seguimiento a las postulaciones, facilitando
                procesos de selección eficientes y contribuyendo al desarrollo
                profesional y la inserción laboral de nuestra comunidad académica.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      <section id="nosotros" className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">

          {/* TEXTO */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="font-sans"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-blue-700">
              Nosotros
            </h2>

            <p className="text-gray-700 text-lg md:text-xl font-medium leading-relaxed text-center">
              Somos un área institucional dedicada a la gestión de convenios,
              vinculación académica y oportunidades laborales, con el objetivo de
              fortalecer la relación entre el Instituto Tecnológico Superior de
              Valladolid y los sectores público, privado y social.
            </p>
          </motion.div>

          {/* IMAGEN */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center mt-12"
          >
            <img
              src="/Convenios/convenio1.webp"
              alt="Área de vinculación institucional"
              className="rounded-xl shadow-lg max-w-md w-full h-auto"
            />
          </motion.div>

        </div>
      </section>

      {/* ================= Footer ================= */}
      <Footer />
    </>
  );
}