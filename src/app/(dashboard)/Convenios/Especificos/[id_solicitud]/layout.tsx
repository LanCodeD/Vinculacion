// app/dashboard/Convenios/Generales/[id_solicitud]/layout.tsx
"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const pasos = [
  { id: "TipoConvenio", nombre: "Tipo de Convenio" },
  { id: "DatosEmpresa", nombre: "Datos de Empresa" },
  { id: "Solicitante", nombre: "Solicitante" },
  { id: "Responsabilidades", nombre: "Responsabilidades" },
  { id: "Participantes", nombre: "Participantes en el Proyecto" },
  { id: "Eventos", nombre: "Eventos" },
  { id: "EstadoSolicitud", nombre: "Estado de la Solicitud" },
];


export default function LayoutConvenioEspecifico({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id_solicitud } = useParams();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#011848] text-white py-4 px-8 flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          Convenio Específicos #{id_solicitud}
        </h1>
        <Link
          href="/Convenios/Especificos"
          className="text-sm underline"
        >
          Volver al inicio
        </Link>
      </header>

      {/* Tabs (steps) */}
      <nav className="flex justify-center gap-4 border-b bg-white shadow-sm">
        {pasos.map((p) => {
          const activo = pathname.endsWith(p.id);
          return (
            <Link
              key={p.id}
              href={`/Convenios/Especificos/${id_solicitud}/${p.id}`}
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

      {/* Contenido del paso */}
      <main className="p-8">{children}</main>
    </div>
  );
}
