// app/BolsaTrabajo/[id]/page.tsx
import React from 'react';
import VacanteDetail from '@/components/VacanteDetail';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";


interface VacantePageProps {
    params: { id: string };
}

export default async function VacantePage({ params }: VacantePageProps) {
    const id = Number(params.id); // ✅ Next.js App Router compatible

    const vacante = await prisma.ofertas.findUnique({
        where: { id_ofertas: id },
        select: {
            titulo: true,
            puesto: true,
            descripcion: true,
            imagen: true,
            ubicacion: true,
        },
    });

    if (!vacante) {
        return <p className="text-center text-gray-500 mt-20">Vacante no encontrada</p>;
    }

    return (
        <VacanteDetail
            titulo={vacante.titulo}
            puesto={vacante.puesto ?? 'Sin puesto especificado'}
            descripcion={vacante.descripcion ?? 'Sin descripción disponible'}
            imagen={vacante.imagen ?? 'https://dummyimage.com/720x400'}
            ubicacion={vacante.ubicacion ?? 'No especificada'}
        />
    );
}
