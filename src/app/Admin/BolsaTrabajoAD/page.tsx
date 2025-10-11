// src/app/Admin/BolsaTrabajoAD/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4">Título</th>
              <th className="py-2 px-4">Empresa</th>
              <th className="py-2 px-4">Estado</th>
              <th className="py-2 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vacantes.map((v) => (
              <tr key={v.id_ofertas} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{v.titulo}</td>
                <td className="py-2 px-4">{v.empresas?.nombre_comercial ?? "Sin empresa"}</td>
                <td className="py-2 px-4 font-semibold">{v.estado?.nombre_estado ?? "Sin estado"}</td>
                <td className="py-2 px-4 text-right">
                  <Link
                    href={`/Admin/BolsaTrabajoAD/${v.id_ofertas}`}
                    className="text-blue-600 hover:underline"
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
