import React, { useEffect, useState } from "react";
import type { DatosRegistro, PerfilEgresado } from "@/types/registro";
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

export default function PasoPerfilEgresado({
  registro,
  setRegistro,
  onNext,
  onBack,
}: Props) {
  const perfil = registro.perfilEgresado || {
    matricula: "",
    titulo: "",
    puesto: "",
    fechaEgreso: "",
    correoInstitucional: "",
    academiasIngenieriasId: 0,
  };

  const [academias, setAcademias] = useState<Academia[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Obtener academias para el select
    axios
      .get("/api/Registro/perfil-egresado")
      .then((res) => setAcademias(res.data))
      .catch((err) => console.error(err));
      
  }, []);

  const handleChange = (
    field: keyof PerfilEgresado,
    value: string | number
  ) => {
    setRegistro((prev) => ({
      ...prev,
      perfilEgresado: {
        ...perfil,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    console.log("Este es el usuarioid", registro.usuarioId)
    if (!registro.usuarioId) {
      toast.error(
        "No se encontró el usuario. Completa primero los datos básicos."
      );
      return;
    }

    // Validaciones simples del frontend
    if (
      !perfil.matricula ||
      !perfil.academiasIngenieriasId
    ) {
      toast.error("Completa los campos obligatorios.");
      return;
    }

    const payload = {
      usuarios_id: registro.usuarioId,
      matricula: perfil.matricula,
      titulo: perfil.titulo,
      puesto: perfil.puesto,
      fecha_egreso: perfil.fechaEgreso || null,
      correo_institucional: perfil.correoInstitucional,
      academias_ingenierias_id: perfil.academiasIngenieriasId,
    };

    setLoading(true);
    try {
      await axios.post("/api/Registro/perfil-egresado", payload);
      toast.success("Perfil de egresado guardado con éxito");
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
    <div className="w-full max-w-md flex flex-col gap-4 text-black">
      <h2 className="text-xl font-bold">Perfil de Egresado</h2>

      <input
        type="text"
        placeholder="Matrícula"
        value={perfil.matricula}
        onChange={(e) => handleChange("matricula", e.target.value)}
        className="border rounded p-2"
      />

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

      <input
        type="date"
        placeholder="Año de Egresado"
        value={perfil.fechaEgreso}
        onChange={(e) => handleChange("fechaEgreso", e.target.value)}
        className="border rounded p-2"
      />

      <input
        type="email"
        placeholder="Correo institucional"
        value={perfil.correoInstitucional}
        onChange={(e) => handleChange("correoInstitucional", e.target.value)}
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
        <option value={0}>Selecciona la academia cursada</option>
        {academias.map((a) => (
          <option key={a.id_academias} value={a.id_academias} className="text-black">
            {a.ingenieria}
          </option>
        ))}
      </select>

      <div className="flex justify-between mt-4">
{/*         <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">
          Atrás
        </button> */}
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
