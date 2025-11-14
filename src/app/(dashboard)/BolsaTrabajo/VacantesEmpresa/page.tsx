// src/app/(dashboard)/BolsaTrabajo/VacantesEmpresa/page.tsx
"use client";
import VacantesEmpresaList from "@/components/Componentes_empresas/VacanteEmpresaLista";

export default function VacantesEmpresa() {
  return (
    <section className="text-gray-700 body-font">
      <div className="container px-5 py-24 mx-auto -max-lg:px-0 -mt-15">
        <h1 className="text-2xl font-bold mb-6">Mis Vacantes</h1>
        <VacantesEmpresaList />
      </div>
    </section>
  );
}
