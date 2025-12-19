"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import LoaderIndicador from "@/components/Loader";

// 🔹 Tipos de datos para mayor claridad
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

export default function PasoResponsabilidadesEspecificoAdmin() {
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
          `/api/Convenios/Especificos/${id_solicitud}/Responsabilidades`
        );

        if (data?.length) {
          const nuevoForm: FormResponsabilidades = {
            plantel: { financieros: "", academicos: "", entregables: "" },
            empresa: { financieros: "", academicos: "", entregables: "" },
          };

          data.forEach((r: Responsable) => {
            const actor = r.actor.nombre;
            const categoria = r.categoria.nombre;
            nuevoForm[actor][categoria] = r.contenido ?? "";
          });

          setForm(nuevoForm);
        }
      } catch (err) {
        console.error("❌ Error al cargar responsabilidades:", err);
      } finally {
        setCargando(false);
      }
    };

    if (id_solicitud) cargar();
  }, [id_solicitud]);

  if (cargando) {
    return <LoaderIndicador mensaje="Cargando datos de Responsabilidades..." />;
  }


  // 🔹 Renderizado de cada bloque de responsabilidades (plantel / empresa)
  const renderSeccion = (titulo: string, actor: keyof FormResponsabilidades) => (
    <div className="space-y-4 border p-4 rounded-xl bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold text-[#011848] mb-3">{titulo}</h3>

      {(["financieros", "academicos", "entregables"] as const).map((campo) => (
        <div key={campo}>
          <label className="block text-sm font-medium text-gray-700 capitalize">
            {campo}
          </label>
          <p className="border rounded-lg p-3 bg-white mt-1 min-h-12 text-gray-800 whitespace-pre-line">
            {form[actor][campo] || "—"}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-black">
      <h2 className="text-2xl font-bold text-[#011848]">
        Responsabilidades del Proyecto
      </h2>

      {/* 🔹 Secciones separadas */}
      {renderSeccion("Responsabilidades del PLANTEL", "plantel")}
      {renderSeccion("Responsabilidades de la EMPRESA o DEPENDENCIA", "empresa")}

      {/* 🔹 Nota final */}
      <div className="text-sm text-gray-500 italic border-t pt-4">
        *Esta información fue proporcionada por el solicitante.
      </div>
    </div>
  );
}
