import React, { useEffect, useState } from "react";
import type { DatosRegistro, PerfilDocente } from "@/types/registro";
import axios from "axios";
import toast from "react-hot-toast";

interface Academia {
  id_academias: number;
  ingenieria: string;
}

interface Props {
  registro: DatosRegistro;
  setRegistro: React.Dispatch<React.SetStateAction<DatosRegistro>>;
  onNext: () => void;
  onBack: () => void;
}

export default function PasoPerfilDocente({
  registro,
  setRegistro,
  onNext,
  onBack,
}: Props) {
  const perfil: PerfilDocente = registro.perfilDocente || {
    titulo: "",
    puesto: "",
    academiasIngenieriasId: 0,
  };

  const [academias, setAcademias] = useState<Academia[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar academias y empresas al montar
  useEffect(() => {
    axios
      .get("/api/Registro/perfil-egresado")
      .then((res) => setAcademias(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (field: keyof typeof perfil, value: string | number) => {
    setRegistro((prev) => ({
      ...prev,
      perfilDocente: {
        ...perfil,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!registro.usuarioId) {
      toast.error(
        "No se encontró el usuario. Completa primero los datos básicos."
      );
      return;
    }

    const payload = {
      usuarios_id: registro.usuarioId,
      titulo: perfil.titulo,
      puesto: perfil.puesto,
      academias_ingenierias_id: perfil.academiasIngenieriasId,
    };

    setLoading(true);
    try {
      await axios.post("/api/Registro/perfil-docente", payload);
      toast.success("Perfil de docente guardado con éxito");
      onNext();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? "Error en el servidor");
      } else {
        toast.error("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl">
        <h2 className="text-4xl font-extrabold text-center text-sky-700 mb-14 drop-shadow-sm">
          Perfil de Docente
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 text-gray-800">
          {/* Título */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={perfil.titulo}
              onChange={(e) => handleChange("titulo", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400 transition"
              placeholder="Lic., Ing., Mtro."
            />
          </div>

          {/* Puesto */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Puesto
            </label>
            <input
              type="text"
              value={perfil.puesto}
              onChange={(e) => handleChange("puesto", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400 transition"
              placeholder="Ej. Coordinador, Docente"
            />
          </div>

          {/* Academia */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Academia actual <span className="text-red-500">*</span>
            </label>
            <select
              value={perfil.academiasIngenieriasId}
              required
              onChange={(e) =>
                handleChange("academiasIngenieriasId", Number(e.target.value))
              }
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition bg-white"
            >
              <option value={0}>Selecciona su academia actual</option>
              {academias.map((a) => (
                <option key={a.id_academias} value={a.id_academias}>
                  {a.ingenieria}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Botón */}
        <div className="flex justify-end mt-12">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-sky-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-sky-700 transition disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}
