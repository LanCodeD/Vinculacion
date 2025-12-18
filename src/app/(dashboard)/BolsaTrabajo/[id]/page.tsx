// src/app/%28dashboard%29/BolsaTrabajo/%5Bid%5D/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import VacanteDetail from "@/components/Componentes_vacantes/VacanteDetail";

interface VacantePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VacantePage({ params }: VacantePageProps) {

  const { id } = await params;
  const vacanteId = Number(id);


  if (isNaN(vacanteId)) {
    notFound();
  }


  const vacante = await prisma.ofertas.findUnique({
    where: { id_ofertas: vacanteId },
    select: {
      id_ofertas: true,
      titulo: true,
      puesto: true,
      descripcion_general: true,
      requisitos: true,
      horario: true,
      modalidad: true,
      imagen: true,
      ubicacion: true,
      fecha_cierre: true,
    },
  });

  if (!vacante) {
    notFound();
  }

  return (
    <VacanteDetail
      id={vacante.id_ofertas}
      titulo={vacante.titulo}
      puesto={vacante.puesto ?? "Sin puesto especificado"}
      descripcion={vacante.descripcion_general ?? "Sin descripción disponible"}
      requisitos={vacante.requisitos ?? "Sin requisitos especificados"}
      horario={vacante.horario ?? "No especificado"}
      modalidad={vacante.modalidad ?? "No especificada"}
      imagen={vacante.imagen || "/placeholder.webp"}
      ubicacion={vacante.ubicacion ?? "No especificada"}
      fecha_cierre={
        vacante.fecha_cierre
          ? new Intl.DateTimeFormat("es-MX").format(
              new Date(vacante.fecha_cierre)
            )
          : null
      }
    />
  );
}

