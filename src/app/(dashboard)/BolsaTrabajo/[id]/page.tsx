import React from 'react';
import VacanteDetail from '@/components/Componentes_vacantes/VacanteDetail';
import { prisma } from '@/lib/prisma';

interface VacantePageProps {
  params: Promise<{ id: string }>;
}

export default async function VacantePage({ params }: VacantePageProps) {
  const { id } = await params; // ✅ ahora sí es correcto
  const vacanteId = Number(id);

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
    return <p className="text-center text-gray-500 mt-20">Vacante no encontrada</p>;
  }

  return (
    <VacanteDetail
      id={vacante.id_ofertas}
      titulo={vacante.titulo}
      puesto={vacante.puesto ?? 'Sin puesto especificado'}
      descripcion={vacante.descripcion_general ?? 'Sin descripción disponible'}
      requisitos={vacante.requisitos ?? 'Sin requisitos especificados'}
      horario={vacante.horario ?? 'No especificado'}
      modalidad={vacante.modalidad ?? 'No especificada'}
      imagen={vacante.imagen ?? 'https://dummyimage.com/720x400'}
      ubicacion={vacante.ubicacion ?? 'No especificada'}
      fecha_cierre={
        vacante.fecha_cierre
          ? new Date(vacante.fecha_cierre).toISOString()
          : null
      }
    />
  );
}

