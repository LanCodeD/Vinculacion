import { prisma } from "@/lib/prisma";
import AdminVacanteDetailClient from "@/components/VacanteDetailClient";

type Props = { params: { id: string } };

export default async function AdminVacanteDetailPage({ params }: Props) {
  const id = parseInt(params.id);

  const vacante = await prisma.ofertas.findUnique({
    where: { id_ofertas: id },
    include: {
      empresas: { select: { nombre_comercial: true, usuarios_id: true } },
      estado: { select: { nombre_estado: true } },
    },
  });

  if (!vacante) {
    return <p className="p-6 text-red-500">Vacante no encontrada</p>;
  }

  return <AdminVacanteDetailClient vacante={vacante} />;
}
