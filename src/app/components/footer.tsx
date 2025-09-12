import React from "react";
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 pt-10">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 text-gray-800">

        {/* Secciones del footer */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 pb-10">
          <div>
            <h3 className="text-blue-700 font-bold text-xl mb-2">
              Área de vinculación y bolsa de trabajo
            </h3>
            <p className="text-gray-600 text-sm">Texto</p>
          </div>

          <div>
            <h4 className="text-blue-700 uppercase font-bold text-sm mb-2">Recursos</h4>
            <ul className="text-gray-700 text-sm space-y-1">
              <li><a href="/#" className="hover:text-blue-700">Documentación</a></li>
              <li><a href="/#" className="hover:text-blue-700">Tutoriales</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-blue-700 uppercase font-bold text-sm mb-2">Soporte</h4>
            <ul className="text-gray-700 text-sm space-y-1">
              <li><a href="/#" className="hover:text-blue-700">Centro de ayuda</a></li>
              <li><a href="/#" className="hover:text-blue-700">Política de privacidad</a></li>
              <li><a href="/#" className="hover:text-blue-700">Términos y condiciones</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-blue-600 uppercase font-bold text-sm mb-2">Contáctanos</h4>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>Carretera Valladolid - Tizimin Km 3.5, Valladolid, Yucatán</li>
              <li>
                <a href="mailto:contact@company.com" className="hover:text-blue-600">
                  contact@company.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Decoración */}
        <div className="w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 rounded-full mb-6"></div>

        {/* Redes sociales */}
        <div className="flex flex-row space-x-6 justify-center mb-6">
          <a href="https://x.com/TecnmValladolid" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
            <FaTwitter className="h-6 w-6" />
          </a>
          <a href="https://www.facebook.com/TecNMValladolid" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
            <FaFacebook className="h-6 w-6" />
          </a>
          <a href="https://www.instagram.com/tecnmvalladolid/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
            <FaInstagram className="h-6 w-6" />
          </a>
          <a href="http://www.youtube.com/@tecnmcampusvalladolid4146" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
            <FaYoutube className="h-6 w-6" />
          </a>
        </div>

        <div className="text-center text-gray-600 text-sm pb-6">
          Todos los derechos reservados &copy; 2024 Área de vinculación y bolsa de trabajo ITSVA
        </div>
      </div>
    </footer>
  );
};

export default Footer;
