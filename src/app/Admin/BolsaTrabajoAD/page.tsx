// src/app/Admin/BolsaTrabajoAD/page.tsx
import { prisma } from "@/lib/prisma";
import TablaVacantes from "@/components/TablaVacantes";

type VacanteConRelaciones = {
  id_ofertas: number;
  titulo: string;
  puesto: string | null;
  empresas: { nombre_comercial: string } | null;
  estado: { nombre_estado: string } | null;
};

export const dynamic = "force-dynamic";

export default async function AdminBolsaTrabajoPage() {
  const vacantes: VacanteConRelaciones[] = await prisma.ofertas.findMany({
    include: {
      empresas: { select: { nombre_comercial: true } },
      estado: { select: { nombre_estado: true } },
    },
    orderBy: { creado_en: "desc" },
  });

  return (
    <section className="px-5 py-10">
      <h1 className="text-3xl font-bold mb-6">Gestión de Vacantes</h1>
      <TablaVacantes vacantes={vacantes} />
    </section>
  );
}
