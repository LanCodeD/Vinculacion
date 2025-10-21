"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

// 🔹 Tipos para consistencia
interface Responsable {
  actor: { nombre: "plantel" | "empresa" };
  categoria: { nombre: "financieros" | "academicos" | "entregables" };
  contenido: string | null;
}

interface FormResponsabilidades {
  plantel: {
    financieros: string;
    academicos: string;
    entregables: string;
  };
  empresa: {
    financieros: string;
    academicos: string;
    entregables: string;
  };
}

export default function AdminResponsabilidades() {
  const { id_solicitud } = useParams();
  const [form, setForm] = useState<FormResponsabilidades>({
    plantel: { financieros: "", academicos: "", entregables: "" },
    empresa: { financieros: "", academicos: "", entregables: "" },
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get<Responsable[]>(
          `/api/Convenios/Generales/${id_solicitud}/Responsabilidades`
        );

        if (data?.length) {
          const nuevoForm: FormResponsabilidades = {
            plantel: { financieros: "", academicos: "", entregables: "" },
            empresa: { financieros: "", academicos: "", entregables: "" },
          };

          data.forEach((r) => {
            const actor = r.actor.nombre;
            const categoria = r.categoria.nombre;
            nuevoForm[actor][categoria] = r.contenido ?? "";
          });

          setForm(nuevoForm);
        }
      } catch (err) {
        console.warn("No se pudieron cargar las responsabilidades", err);
      } finally {
        setCargando(false);
      }
    };

    if (id_solicitud) cargar();
  }, [id_solicitud]);

  if (cargando)
    return <p className="text-center py-10 text-gray-700">Cargando datos...</p>;

  // 🔹 Renderizado de secciones para PLANTEL y EMPRESA
  const renderSeccion = (
    titulo: string,
    actor: keyof FormResponsabilidades
  ) => (
    <div className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
      <h3 className="text-lg font-semibold text-[#011848] mb-2">{titulo}</h3>

      {(["financieros", "academicos", "entregables"] as const).map((campo) => (
        <div key={campo}>
          <p className="text-sm font-medium capitalize text-gray-700">
            {campo}
          </p>
          <p className="border rounded-lg p-3 bg-gray-50 text-gray-800 whitespace-pre-line min-h-[60px]">
            {form[actor][campo] ? form[actor][campo] : "—"}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-black">
      <h2 className="text-2xl font-bold text-[#011848]">
        Responsabilidades
      </h2>

      {renderSeccion("Responsabilidades del PLANTEL", "plantel")}
      {renderSeccion("Responsabilidades de la EMPRESA o DEPENDENCIA", "empresa")}

      <div className="text-sm text-gray-500 italic">
        *Información proporcionada por el solicitante.
      </div>
    </div>
  );
}
