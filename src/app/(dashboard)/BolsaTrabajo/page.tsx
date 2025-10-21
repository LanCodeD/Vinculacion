// app/(dashboard)/BolsaTrabajo/page.tsx
import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import VacanteCard from "@/components/Componentes_vacantes/VacanteCard";
import VacantesEmpresaLista from "@/components/Componentes_empresas/VacanteEmpresaLista";
import Link from "next/link";


export default async function BolsaTrabajoPage() {
  const session = await getServerSession(authOptions);
  const userRoleId = session?.user?.roles_id;

  // Si no hay sesión
  if (!session?.user) {
    return (
      <div className="text-center py-24 text-gray-500">
        Debes iniciar sesión para acceder a esta sección.
      </div>
    );
  }

  // Solo egresados (rol 2) pueden ver vacantes
  const esEgresado = userRoleId === 2;
  const esEmpresa = userRoleId === 3;

  // Si no es egresado ni empresa
  if (!esEgresado && !esEmpresa) {
    return (
      <div className="text-center py-24 text-gray-500">
        No tienes permisos para ver esta sección.
      </div>
    );
  }

  // Si es empresa, verificar permiso para crear vacantes
  let puedeCrearVacante = false;
  if (esEmpresa) {
    const permiso = await prisma.roles_permisos.findFirst({
      where: {
        roles_id: userRoleId,
        permisos: { nombre: "crear_vacante" },
      },
      include: { permisos: true },
    });
    puedeCrearVacante = Boolean(permiso);
  }

  // Si es egresado, verificar permiso para ver bolsa de trabajo
  let puedeVerBolsa = false;
  if (esEgresado) {
    const permiso = await prisma.roles_permisos.findFirst({
      where: {
        roles_id: userRoleId,
        permisos: { nombre: "ver_bolsa_trabajo" },
      },
      include: { permisos: true },
    });
    puedeVerBolsa = Boolean(permiso);
  }

  // Mostrar vacantes solo si tiene permiso
  let vacantes: any[] = [];
  if (puedeVerBolsa) {
    vacantes = await prisma.ofertas.findMany({
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
  }

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto max-lg:px-0 -mt-20">
        <div className="flex flex-wrap w-full mb-20">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
              Bolsa de Trabajo
            </h1>
            <div className="h-1 w-20 bg-blue-500 rounded"></div>
          </div>
          <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">
            {esEgresado
              ? "Explora las oportunidades laborales disponibles para egresados."
              : "Gestiona tus vacantes como empresa registrada."}
          </p>
        </div>

        {/* Botones solo visibles para empresas */}
        {(esEmpresa && puedeCrearVacante) && (
          <div className="flex gap-4 mb-6 -mt-15">
            <Link
              href="/BolsaTrabajo/CreacionVacante"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Crear Vacante
            </Link>
          </div>
        )}

        {/* Vacantes públicas solo visibles para egresados */}
        {esEgresado && puedeVerBolsa && (
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
              <p className="p-6 text-gray-500">
                No hay vacantes disponibles en este momento.
              </p>
            )}
          </div>
        )}

        {/* Vacantes de la empresa solo visibles para empresas */}
        {esEmpresa && puedeCrearVacante && (
          <div className="-mt-1">
            <h2 className="text-2xl font-bold mb-4">Mis Vacantes</h2>
            <VacantesEmpresaLista />
          </div>
        )}
      </div>
    </section>
  );
}
