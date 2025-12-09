import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export default function PaginaNoPermisos() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br bg-gray-50">
      <div className="bg-gray-900 backdrop-blur-xl rounded-2xl shadow-xl p-10 text-center max-w-lg">
        {/* Icono */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500/10 p-4 rounded-full">
            <LockKeyhole className="h-12 w-12 text-yellow-500" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-2">
          Acceso denegado
        </h1>
        <p className="text-gray-200  mb-6">
          No tienes permisos para acceder a esta página.  
          Si crees que esto es un error, comunícate con el administrador.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            href="/Admin/Contactos"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white  shadow-lg font-medium transition-colors"
          >
            Volver
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-3xl text-gray-600">
        Error 403 · © {new Date().getFullYear()} Vinculación ITSVA
      </p>
    </div>
  );
}
