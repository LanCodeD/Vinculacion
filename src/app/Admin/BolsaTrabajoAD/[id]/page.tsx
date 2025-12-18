import React from "react";
import { prisma } from "@/lib/prisma";
import AdminVacanteDetailClient from "@/components/Componentes_administrador/VacanteDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminVacantePage({ params }: Props) {
  const { id } = await params; 
  const vacanteId = Number(id);

  if (!id || isNaN(vacanteId)) {
    console.error("❌ ID inválido:", id);
    return <p className="text-center text-gray-500 mt-20">ID inválido</p>;
  }

  const vacante = await prisma.ofertas.findUnique({
    where: { id_ofertas: vacanteId },
    include: {
      empresas: {
        select: {
          nombre_comercial: true,
          usuarios_id: true,
        },
      },
      estado: {
        select: {
          id_oferta_estados: true, nombre_estado: true
        },
      },
      ingenierias_ofertas: {
        include: {
          academia: {
            select: {
              ingenieria: true,
            },
          },
        },
      },
    },
  });

  if (!vacante) {
    return <p className="text-center text-gray-500 mt-20">Vacante no encontrada</p>;
  }

  return <AdminVacanteDetailClient vacante={vacante} />;
}
