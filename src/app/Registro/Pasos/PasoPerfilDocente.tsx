import React, { useEffect, useState } from "react";
import type { DatosRegistro, PerfilDocente } from "@/types/registro";
import axios from "axios";
import toast from "react-hot-toast";

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

  const [academias, setAcademias] = useState<
    { id_academias: number; ingenieria: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar academias y empresas al montar
  useEffect(() => {
    axios
      .get("/api/academias")
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
      await axios.post("/api/perfiles/docentes", payload);
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
    <div className="w-full max-w-md flex flex-col gap-4">
      <h2 className="text-xl font-bold">Perfil de Docente</h2>

      <input
        type="text"
        placeholder="Título"
        value={perfil.titulo}
        onChange={(e) => handleChange("titulo", e.target.value)}
        className="border rounded p-2"
      />

      <input
        type="text"
        placeholder="Puesto"
        value={perfil.puesto}
        onChange={(e) => handleChange("puesto", e.target.value)}
        className="border rounded p-2"
      />

      <select
        value={perfil.academiasIngenieriasId}
        required
        onChange={(e) =>
          handleChange("academiasIngenieriasId", Number(e.target.value))
        }
        className="border rounded p-2"
      >
        <option value={0}>Selecciona su academia actual</option>
        {academias.map((a) => (
          <option key={a.id_academias} value={a.id_academias}>
            {a.ingenieria}
          </option>
        ))}
      </select>

      <div className="flex justify-between mt-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Guardando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
