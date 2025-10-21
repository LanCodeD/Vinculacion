"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useEstadoPaso } from "@/hook/EstadoPasoEspecifico";

export default function PasoParticipantes() {
  const { id_solicitud } = useParams();
  const { estadoPaso, bloqueado } = useEstadoPaso(id_solicitud as string, "Participantes");

  const [docentes, setDocentes] = useState([
    { nombre_completo: "", grado_academico: "", programa_educativo: "", rol_en_proyecto: "" },
  ]);
  const [estudiantes, setEstudiantes] = useState([
    { nombre_completo: "", genero: "", programa_educativo: "", semestre: "", grupo: "" },
  ]);
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  // 🔹 Cargar datos existentes desde el backend
  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get(`/api/Convenios/Especificos/${id_solicitud}/Participantes`);
        if (data.docentes?.length) setDocentes(data.docentes);
        if (data.estudiantes?.length) setEstudiantes(data.estudiantes);
      } catch {
        console.warn("No se pudieron cargar los participantes");
      } finally {
        setCargando(false);
      }
    };
    if (id_solicitud) cargar();
  }, [id_solicitud]);

  const validarCampos = () => {
    // 🔹 Validar docentes
    for (let i = 0; i < docentes.length; i++) {
      const d = docentes[i];
      if (!d.nombre_completo.trim() || !d.grado_academico.trim() || !d.programa_educativo.trim() || !d.rol_en_proyecto.trim()) {
        toast.error(`Faltan datos obligatorios en el docente ${i + 1}`);
        return false;
      }
    }

    // 🔹 Validar estudiantes
    for (let i = 0; i < estudiantes.length; i++) {
      const e = estudiantes[i];
      if (!e.nombre_completo.trim() || !e.programa_educativo.trim() || !e.semestre.trim() || !e.grupo.trim()) {
        toast.error(`Faltan datos obligatorios en el estudiante ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  // 🔹 Funciones para manejar dinámicamente las filas
  const agregarDocente = () => {
    setDocentes([...docentes, { nombre_completo: "", grado_academico: "", programa_educativo: "", rol_en_proyecto: "" }]);
  };

  const eliminarDocente = (index: number) => {
    setDocentes(docentes.filter((_, i) => i !== index));
  };

  const agregarEstudiante = () => {
    setEstudiantes([...estudiantes, { nombre_completo: "", genero: "", programa_educativo: "", semestre: "", grupo: "" }]);
  };

  const eliminarEstudiante = (index: number) => {
    setEstudiantes(estudiantes.filter((_, i) => i !== index));
  };

  // 🔹 Guardar cambios
  const guardar = async () => {
    if (!validarCampos()) return; // 🚫 si hay error, no continúa
    const toastId = toast.loading("Guardando participantes...");
    setGuardando(true);
    try {
      await axios.put(`/api/Convenios/Especificos/${id_solicitud}/Participantes`, {
        docentes,
        estudiantes,
      });
      toast.success("Participantes guardados correctamente ✅", { id: toastId });
    } catch (err) {
      toast.error("Error al guardar los participantes ❌", { id: toastId });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p className="text-center py-6">Cargando datos...</p>;

  const bloqueadoPaso = bloqueado || estadoPaso === "EN REVISION" || estadoPaso === "APROBADO";

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-black">
      <h2 className="text-xl font-semibold text-[#011848]">Participantes en el Proyecto</h2>

      {/* ==== DOCENTES ==== */}
      <div>
        <h3 className="text-lg font-medium text-[#011848] mb-3">Docentes participantes</h3>
        <table className="w-full border text-sm">
          <thead className="bg-[#011848] text-white">
            <tr>
              <th className="p-2 w-12">No.</th>
              <th className="p-2">Nombre completo</th>
              <th className="p-2">Grado académico</th>
              <th className="p-2">Programa educativo</th>
              <th className="p-2">Rol en el proyecto</th>
              {!bloqueadoPaso && <th className="p-2">Acción</th>}
            </tr>
          </thead>
          <tbody>
            {docentes.map((docente, i) => (
              <tr key={i} className="border-b">
                <td className="p-2 text-center">{i + 1}</td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full border rounded p-1"
                    value={docente.nombre_completo}
                    onChange={(e) =>
                      setDocentes(docentes.map((d, j) =>
                        j === i ? { ...d, nombre_completo: e.target.value } : d
                      ))
                    }
                    disabled={bloqueadoPaso}
                  />
                </td>
                                <td className="p-2">
                  <input
                    type="text"
                    className="w-full border rounded p-1"
                    value={docente.grado_academico}
                    onChange={(e) =>
                      setDocentes(docentes.map((d, j) =>
                        j === i ? { ...d, grado_academico: e.target.value } : d
                      ))
                    }
                    disabled={bloqueadoPaso}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full border rounded p-1"
                    value={docente.programa_educativo}
                    onChange={(e) =>
                      setDocentes(docentes.map((d, j) =>
                        j === i ? { ...d, programa_educativo: e.target.value } : d
                      ))
                    }
                    disabled={bloqueadoPaso}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full border rounded p-1"
                    value={docente.rol_en_proyecto}
                    onChange={(e) =>
                      setDocentes(docentes.map((d, j) =>
                        j === i ? { ...d, rol_en_proyecto: e.target.value } : d
                      ))
                    }
                    disabled={bloqueadoPaso}
                  />
                </td>
                {!bloqueadoPaso && (
                  <td className="p-2 text-center">
                    <button
                      onClick={() => eliminarDocente(i)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {!bloqueadoPaso && (
          <button
            onClick={agregarDocente}
            className="mt-3 bg-[#53b431] text-white px-4 py-1 rounded-lg hover:bg-[#449a29]"
          >
            + Agregar docente
          </button>
        )}
      </div>

      {/* ==== ESTUDIANTES ==== */}
      <div>
        <h3 className="text-lg font-medium text-[#011848] mb-3">Estudiantes participantes</h3>
        <table className="w-full border text-sm">
          <thead className="bg-[#011848] text-white">
            <tr>
              <th className="p-2 w-12">No.</th>
              <th className="p-2">Nombre completo</th>
              <th className="p-2">Género</th>
              <th className="p-2">Programa educativo</th>
              <th className="p-2">Semestre</th>
              <th className="p-2">Grupo</th>
              {!bloqueadoPaso && <th className="p-2">Acción</th>}
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((est, i) => (
              <tr key={i} className="border-b">
                <td className="p-2 text-center">{i + 1}</td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full border rounded p-1"
                    value={est.nombre_completo}
                    onChange={(e) =>
                      setEstudiantes(estudiantes.map((d, j) =>
                        j === i ? { ...d, nombre_completo: e.target.value } : d
                      ))
                    }
                    disabled={bloqueadoPaso}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full border rounded p-1"
                    value={est.genero}
                    onChange={(e) =>
                      setEstudiantes(estudiantes.map((d, j) =>
                        j === i ? { ...d, genero: e.target.value } : d
                      ))
                    }
                    disabled={bloqueadoPaso}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full border rounded p-1"
                    value={est.programa_educativo}
                    onChange={(e) =>
                      setEstudiantes(estudiantes.map((d, j) =>
                        j === i ? { ...d, programa_educativo: e.target.value } : d
                      ))
                    }
                    disabled={bloqueadoPaso}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full border rounded p-1"
                    value={est.semestre}
                    onChange={(e) =>
                      setEstudiantes(estudiantes.map((d, j) =>
                        j === i ? { ...d, semestre: e.target.value } : d
                      ))
                    }
                    disabled={bloqueadoPaso}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full border rounded p-1"
                    value={est.grupo}
                    onChange={(e) =>
                      setEstudiantes(estudiantes.map((d, j) =>
                        j === i ? { ...d, grupo: e.target.value } : d
                      ))
                    }
                    disabled={bloqueadoPaso}
                  />
                </td>
                {!bloqueadoPaso && (
                  <td className="p-2 text-center">
                    <button
                      onClick={() => eliminarEstudiante(i)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {!bloqueadoPaso && (
          <button
            onClick={agregarEstudiante}
            className="mt-3 bg-[#53b431] text-white px-4 py-1 rounded-lg hover:bg-[#449a29]"
          >
            + Agregar estudiante
          </button>
        )}
      </div>

      {!bloqueadoPaso && (
        <div className="pt-4">
          <button
            onClick={guardar}
            disabled={guardando}
            className="bg-[#011848] text-white px-6 py-2 rounded-lg hover:bg-[#001234] font-semibold"
          >
            {guardando ? "Guardando..." : "Guardar participantes"}
          </button>
        </div>
      )}
    </div>
  );
}
