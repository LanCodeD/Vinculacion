// src/app/Admin/BolsaTrabajoAD/page.tsx
import { prisma } from "@/lib/prisma";
import TablaVacantes from "@/components/Componentes_administrador/TablaVacantes";
import Link from "next/link";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 5;

export default async function AdminBolsaTrabajoPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const totalVacantes = await prisma.ofertas.count();

  const vacantes = await prisma.ofertas.findMany({
    skip,
    take: ITEMS_PER_PAGE,
    orderBy: { creado_en: "desc" },
    include: {
      empresas: {
        select: {
          nombre_comercial: true,
          correo_empresas: true,
          telefono: true,
        },
      },
      estado: {
        select: {
          id_oferta_estados: true,
          nombre_estado: true,
        },
      },
    },
  });

  const totalPages = Math.ceil(totalVacantes / ITEMS_PER_PAGE);

  return (
    <section className="px-5 py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Gestión de Vacantes</h1>

        <Link
          href="/BolsaTrabajo/CreacionVacante"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Crear Vacante
        </Link>
      </div>

      <TablaVacantes vacantes={vacantes} />

      <div className="flex justify-center gap-2 mt-6">
        <Link
          href={`?page=${page - 1}`}
          className={`px-4 py-2 rounded border ${
            page === 1
              ? "pointer-events-none opacity-50"
              : "hover:bg-gray-100"
          }`}
        >
          Anterior
        </Link>

        <span className="px-4 py-2">
          Página {page} de {totalPages}
        </span>

        <Link
          href={`?page=${page + 1}`}
          className={`px-4 py-2 rounded border ${
            page === totalPages
              ? "pointer-events-none opacity-50"
              : "hover:bg-gray-100"
          }`}
        >
          Siguiente
        </Link>
      </div>
    </section>
  );
}