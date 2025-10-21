"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface Docente {
  nombre_completo: string;
  grado_academico?: string;
  programa_educativo?: string;
  rol_en_proyecto?: string;
}

interface Estudiante {
  nombre_completo: string;
  genero?: string;
  programa_educativo?: string;
  semestre?: string;
  grupo?: string;
}

export default function PasoParticipantesEspecificoAdmin() {
  const { id_solicitud } = useParams();

  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cargando, setCargando] = useState(true);

  // 🔹 Cargar participantes registrados
  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get(
          `/api/Convenios/Especificos/${id_solicitud}/Participantes`
        );

        setDocentes(data.docentes || []);
        setEstudiantes(data.estudiantes || []);
      } catch (error) {
        console.error("❌ Error al cargar participantes:", error);
      } finally {
        setCargando(false);
      }
    };
    if (id_solicitud) cargar();
  }, [id_solicitud]);

  if (cargando)
    return <p className="text-center py-6 text-black">Cargando datos...</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-black">
      <h2 className="text-2xl font-bold text-[#011848]">
        Participantes del Proyecto
      </h2>

      {/* ===================== DOCENTES ===================== */}
      <div className="border rounded-xl bg-gray-50 shadow-sm p-4">
        <h3 className="text-lg font-semibold text-[#011848] mb-4">
          Docentes participantes
        </h3>

        {docentes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead className="bg-[#011848] text-white">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Nombre completo
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Grado académico
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Programa educativo
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Rol en el proyecto
                  </th>
                </tr>
              </thead>
              <tbody>
                {docentes.map((d, i) => (
                  <tr
                    key={i}
                    className={`border-b ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-2">{d.nombre_completo || "—"}</td>
                    <td className="px-4 py-2">{d.grado_academico || "—"}</td>
                    <td className="px-4 py-2">{d.programa_educativo || "—"}</td>
                    <td className="px-4 py-2">{d.rol_en_proyecto || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 italic">No se registraron docentes.</p>
        )}
      </div>

      {/* ===================== ESTUDIANTES ===================== */}
      <div className="border rounded-xl bg-gray-50 shadow-sm p-4">
        <h3 className="text-lg font-semibold text-[#011848] mb-4">
          Estudiantes participantes
        </h3>

        {estudiantes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead className="bg-[#011848] text-white">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Nombre completo
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Género
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Programa educativo
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Semestre
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Grupo
                  </th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((e, i) => (
                  <tr
                    key={i}
                    className={`border-b ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-2">{e.nombre_completo || "—"}</td>
                    <td className="px-4 py-2">{e.genero || "—"}</td>
                    <td className="px-4 py-2">
                      {e.programa_educativo || "—"}
                    </td>
                    <td className="px-4 py-2">{e.semestre || "—"}</td>
                    <td className="px-4 py-2">{e.grupo || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 italic">No se registraron estudiantes.</p>
        )}
      </div>

      {/* ===================== NOTA FINAL ===================== */}
      <div className="text-sm text-gray-500 italic border-t pt-4">
        *Esta información fue proporcionada por el solicitante.
      </div>
    </div>
  );
}
