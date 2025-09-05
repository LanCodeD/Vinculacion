import Image from "next/image";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Home() {
  return (
    <>
      {/* ================= Hero ================= */}
      <section className="pt-8 lg:pt-32 pb-20 bg-[url('https://pagedone.io/asset/uploads/1691055810.png')] bg-center bg-cover">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center">
          {/* Banner superior */}
          <div className="border border-indigo-600 p-1 w-60 mx-auto rounded-full flex items-center justify-between mb-4">
            <span className="font-inter text-xs font-medium text-gray-900 ml-3">
              Explore how to use for brands.
            </span>
            <a href="#" className="w-8 h-8 rounded-full flex justify-center items-center bg-indigo-600">
              <svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.83398 8.00019L12.9081 8.00019M9.75991 11.778L13.0925 8.44541C13.3023 8.23553 13.4073 8.13059 13.4073 8.00019C13.4073 7.86979 13.3023 7.76485 13.0925 7.55497L9.75991 4.22241"
                  stroke="white"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <h1 className="max-w-2xl mx-auto text-center font-manrope font-bold text-4xl text-gray-900 mb-5 md:text-5xl leading-[50px]">
            Sistema de <span className="text-indigo-600">convenios y bolsa de trabajo</span>
          </h1>

          <p className="max-w-sm mx-auto text-center text-base font-normal leading-7 text-gray-500 mb-9">
            Invierte inteligentemente y descubre una mejor manera de gestionar tu riqueza.
          </p>

          <a
            href="#"
            className="w-full md:w-auto mb-6 inline-flex items-center justify-center py-3 px-7 text-base font-semibold text-center text-white rounded-full bg-indigo-600 shadow-xs hover:bg-indigo-700 transition-all duration-500"
          >
            Crear cuenta
            <svg className="ml-2" width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* Imagen responsiva */}
          <div className="flex justify-center mt-6">
            <Image
              src="/banner/estrecho.png"
              alt="Banner convenios y bolsa de trabajo"
              width={600} 
              height={400} 
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-lg"
            />
          </div>

        </div>
      </section>


      {/* ================= Secciones adicionales ================= */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-indigo-600">Convenios</h2>
          <p className="text-gray-700 mb-8">
            Solicitudes.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-indigo-600">Bolsa de trabajo</h2>
          <p className="text-gray-700 mb-8">
            Postulaciones.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-indigo-600">Nosotros</h2>
          <p className="text-gray-700 mb-8">
            Somos un área dedicada a la gestion de convenios y oportunidades laborales.
          </p>
        </div>
      </section>

      {/* ================= Footer ================= */}

      <footer className="bg-gray-100 pt-10">
        {/* Contenedor principal */}
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 text-gray-800">

          {/* Secciones del footer */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 pb-10">
            <div>
              <h3 className="text-indigo-600 font-bold text-xl mb-2">Área de vinculación y bolsa de trabajo</h3>
              <p className="text-gray-600 text-sm">Texto</p>
            </div>

            <div>
              <h4 className="text-indigo-600 uppercase font-bold text-sm mb-2">Recursos</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li><a href="/#" className="hover:text-indigo-600">Documentación</a></li>
                <li><a href="/#" className="hover:text-indigo-600">Tutoriales</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-indigo-600 uppercase font-bold text-sm mb-2">Soporte</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li><a href="/#" className="hover:text-indigo-600">Centro de ayuda</a></li>
                <li><a href="/#" className="hover:text-indigo-600">Política de privacidad</a></li>
                <li><a href="/#" className="hover:text-indigo-600">Términos y condiciones</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-indigo-600 uppercase font-bold text-sm mb-2">Contáctanos</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>Carretera Valladolid - Tizimin Km 3.5, Valladolid, Yucatán</li>
                <li><a href="mailto:contact@company.com" className="hover:text-indigo-600">contact@company.com</a></li>
              </ul>
            </div>
          </div>
          {/*Decoración */}
          <div className="w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full mb-6"></div>

          <div className="flex flex-row space-x-6 justify-center mb-6">
            <a
              href="https://x.com/TecnmValladolid"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600"
            >
              <FaTwitter className="h-6 w-6" />
            </a>
            <a href="https://www.facebook.com/TecNMValladolid"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600">
              <FaFacebook className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/tecnmvalladolid/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600">
              <FaInstagram className="h-6 w-6" />
            </a>
            <a href="http://www.youtube.com/@tecnmcampusvalladolid4146"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600">
              <FaYoutube className="h-6 w-6" />
            </a>
          </div>

          <div className="text-center text-gray-600 text-sm pb-6">
            © Copyright 2025. All Rights Reserved.
          </div>
        </div>
      </footer>

    </>
  );
}
