// app/(dashboard)/BolsaTrabajo/page.tsx
import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import VacanteCard from "@/components/VacanteCard";
import Link from "next/link";

export default async function BolsaTrabajoPage() {
  // Obtener sesión
  const session = await getServerSession(authOptions);
  const esEmpresa = session?.user?.roles_id === 3; // solo rol empresa

  // Obtener vacantes activas
  const vacantes = await prisma.ofertas.findMany({
    where: { oferta_estados_id: 3 }, // Activas
    select: {
      id_ofertas: true,
      titulo: true,
      puesto: true,
      descripcion: true,
      imagen: true,
    },
    orderBy: { fecha_publicacion: "desc" },
  });

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto max-lg:px-0 -mt-20">
        <div className="flex flex-wrap w-full mb-20">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
              Vacantes Disponibles
            </h1>
            <div className="h-1 w-20 bg-blue-500 rounded"></div>
          </div>
          <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">
            Explora las oportunidades de trabajo que tenemos disponibles. Haz click en cada vacante para más información.
          </p>
        </div>

        {/* Botones visibles solo para empresas */}
        {esEmpresa && (
          <div className="flex gap-4 mb-6">
            <Link
              href="/BolsaTrabajo/CreacionVacante"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Crear Vacante
            </Link>
            <Link
              href="/BolsaTrabajo/VacantesEmpresa"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Ver Mis Vacantes
            </Link>
          </div>
        )}

        <div className="flex flex-wrap -m-4">
          {vacantes.length > 0 ? (
            vacantes.map((v) => (
              <VacanteCard
                key={v.id_ofertas}
                id={v.id_ofertas}
                titulo={v.titulo}
                puesto={v.puesto ?? "Sin puesto especificado"}
                descripcion={v.descripcion ?? "Sin descripción disponible"}
                imagen={v.imagen ?? "https://dummyimage.com/720x400"}
              />
            ))
          ) : (
            <p className="p-6 text-gray-500">No hay vacantes disponibles.</p>
          )}
        </div>
      </div>
    </section>
  );
}
