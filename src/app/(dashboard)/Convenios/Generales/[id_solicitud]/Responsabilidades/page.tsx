"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useEstadoPaso } from "@/hook/EstadoPaso";
// 🔹 Tipos para mantener seguridad y claridad
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

export default function PasoResponsabilidades() {
  const params = useParams();
  const id_solicitud = params.id_solicitud;
  const { estadoPaso, bloqueado } = useEstadoPaso(id_solicitud as string, "Responsabilidades");

  // Estado principal tipado correctamente
  const [form, setForm] = useState<FormResponsabilidades>({
    plantel: { financieros: "", academicos: "", entregables: "" },
    empresa: { financieros: "", academicos: "", entregables: "" },
  });

  const [cargando, setCargando] = useState(true);
  
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get<Responsable[]>(
          `/api/Convenios/Generales/${id_solicitud}/Responsabilidades`
        );

        if (data?.length) {
          // Iniciamos estructura vacía pero con tipo definido
          const nuevoForm: FormResponsabilidades = {
            plantel: { financieros: "", academicos: "", entregables: "" },
            empresa: { financieros: "", academicos: "", entregables: "" },
          };

          // Recorremos resultados
          data.forEach((r: Responsable) => {
            const actor = r.actor.nombre; // 'plantel' o 'empresa'
            const categoria = r.categoria.nombre; // 'financieros' | 'academicos' | 'entregables'
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

  // 🔹 Función para guardar los datos
  const guardar = async () => {
    setGuardando(true);
    try {
      await axios.put(`/api/Convenios/Generales/${id_solicitud}/Responsabilidades`, form);
      alert("Responsabilidades guardadas ✅");
    } catch (err) {
      alert("Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p className="text-center py-6 text-black">Cargando datos...</p>;
   const bloqueadoPaso = bloqueado || estadoPaso === "EN REVISION" || estadoPaso === "APROBADO";
    

  // 🔹 Componente interno para mostrar cada bloque (plantel / empresa)
  const renderSeccion = (titulo: string, actor: keyof FormResponsabilidades) => (
    <div className="space-y-4 border p-4 rounded-xl bg-gray-50">
      <h3 className="text-lg font-semibold text-[#011848]">{titulo}</h3>

      {(["financieros", "academicos", "entregables"] as const).map((campo) => (
        <div key={campo} className="text-black">
          <label className="block text-sm font-medium mb-1 capitalize">
            {campo}
          </label>
          <textarea
            rows={3}
            className="w-full border rounded-lg p-2"
            value={form[actor][campo] || ""}
            onChange={(e) =>
              setForm({
                ...form,
                [actor]: { ...form[actor], [campo]: e.target.value },
              })
            }
            disabled={bloqueadoPaso}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-[#011848]">Responsabilidades</h2>

      {renderSeccion("Responsabilidades del PLANTEL", "plantel")}
      {renderSeccion("Responsabilidades de la EMPRESA o DEPENDENCIA", "empresa")}

    {!bloqueadoPaso && (
      <button
        onClick={guardar}
        disabled={guardando}
        className="px-6 py-2 bg-[#53b431] text-white rounded-lg hover:bg-[#459b28] transition"
      >
        {guardando ? "Guardando..." : "Guardar y continuar"}
      </button>
    )}
    </div>
  );
}
