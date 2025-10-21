"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

// 🔹 Pasos actualizados con la nueva nomenclatura
const pasos = [
  { id: "TipoConvenio", nombre: "Tipo de Convenio" },
  { id: "DatosEmpresa", nombre: "Datos de Empresa" },
  { id: "Solicitante", nombre: "Solicitante" },
  { id: "Eventos", nombre: "Eventos" },
  { id: "EstadoSolicitud", nombre: "Estado de la Solicitud" },
];

export default function LayoutAdminConvenio({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id_solicitud } = useParams();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔷 Encabezado */}
      <header className="bg-[#011848] text-white py-4 px-8 flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          Revisión de Convenio General # {id_solicitud}
        </h1>
        <Link href="/Admin/Convenios/Generales" className="text-sm underline">
          ← Volver
        </Link>
      </header>

      {/* 🔹 Navegación entre pasos */}
      <nav className="flex justify-center gap-4 border-b bg-white shadow-sm">
        {pasos.map((p) => {
          const activo = pathname.endsWith(p.id);
          return (
            <Link
              key={p.id}
              href={`/Admin/Convenios/Generales/${id_solicitud}/${p.id}`}
              className={`py-3 px-5 text-sm font-medium transition-all rounded-t-lg ${
                activo
                  ? "bg-[#53b431] text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#011848]"
              }`}
            >
              {p.nombre}
            </Link>
          );
        })}
      </nav>

      {/* 🔸 Contenido dinámico */}
      <main className="p-8">{children}</main>
    </div>
  );
}
