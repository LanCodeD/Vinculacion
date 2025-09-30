import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export default function PaginaNoAutorizada() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-10 text-center max-w-lg">
        {/* Icono */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/10 p-4 rounded-full">
            <LockKeyhole className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
          Acceso denegado
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          No tienes permisos para acceder a esta página.  
          Si crees que esto es un error, contacta con el administrador.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg transition-colors"
          >
            Ir al inicio
          </Link>
          <Link
            href="/IniciarSesion"
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>

      {/* Footer con un toque */}
      <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
        Error 403 · © {new Date().getFullYear()} Vinculación
      </p>
    </div>
  );
}
