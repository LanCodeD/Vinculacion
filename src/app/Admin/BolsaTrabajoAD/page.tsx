// src/app/Admin/BolsaTrabajoAD/page.tsx
import { prisma } from "@/lib/prisma";
import TablaVacantes from "@/components/Componentes_administrador/TablaVacantes";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type VacanteConRelaciones = {
  id_ofertas: number;
  titulo: string;
  puesto: string | null;
  empresas: {
    nombre_comercial: string;
    correo_empresas: string | null;
    telefono: string | null;
  } | null;
  oferta_estados_id: number; // 👈 Se agrega este campo
  estado: { id_oferta_estados: number; nombre_estado: string } | null;
};

export const dynamic = "force-dynamic";

export default async function AdminBolsaTrabajoPage() {
  const vacantes: VacanteConRelaciones[] = await prisma.ofertas.findMany({
    include: {
      empresas: {
        select: {
          nombre_comercial: true,
          correo_empresas: true, telefono: true
        }
      },
      estado: { select: { id_oferta_estados: true, nombre_estado: true } },
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
