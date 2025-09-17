import React, { useState } from "react";
import type { DatosRegistro, PerfilEmpresa } from "@/types/registro";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  registro: DatosRegistro;
  setRegistro: React.Dispatch<React.SetStateAction<DatosRegistro>>;
  onNext: () => void;
  onBack: () => void;
}

export default function PasoPerfilEmpresa({ registro, setRegistro, onNext, onBack }: Props) {
  const perfil: PerfilEmpresa = registro.perfilEmpresa || {
    nombreComercial: "",
    razonSocial: "",
    rfc: "",
    direccion: "",
    correo: "",
    telefono: "",
  };

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof PerfilEmpresa, value: string) => {
    setRegistro((prev) => ({
      ...prev,
      perfilEmpresa: {
        ...perfil,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!registro.usuarioId) {
      toast.error("No se encontró el usuario. Completa primero los datos básicos.");
      return;
    }

    // Validaciones simples
    if (!perfil.nombreComercial || !perfil.rfc) {
      toast.error("Completa los campos obligatorios: Nombre comercial y RFC.");
      return;
    }

    const payload = {
      usuarios_id: registro.usuarioId,
      nombre_comercial: perfil.nombreComercial,
      razon_social: perfil.razonSocial,
      rfc: perfil.rfc,
      direccion: perfil.direccion,
      correo: perfil.correo,
      telefono: perfil.telefono,
    };

    setLoading(true);
    try {
      await axios.post("/api/Registro/perfil-empresa", payload);
      toast.success("Empresa creada con éxito");
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
      <h2 className="text-xl font-bold">Perfil de Empresa</h2>

      <input
        type="text"
        placeholder="Nombre comercial"
        value={perfil.nombreComercial}
        onChange={(e) => handleChange("nombreComercial", e.target.value)}
        className="border rounded p-2"
      />

      <input
        type="text"
        placeholder="Razón social"
        value={perfil.razonSocial}
        onChange={(e) => handleChange("razonSocial", e.target.value)}
        className="border rounded p-2"
      />

      <input
        type="text"
        placeholder="RFC"
        value={perfil.rfc}
        onChange={(e) => handleChange("rfc", e.target.value)}
        className="border rounded p-2"
      />

      <input
        type="text"
        placeholder="Dirección"
        value={perfil.direccion}
        onChange={(e) => handleChange("direccion", e.target.value)}
        className="border rounded p-2"
      />

      <input
        type="email"
        placeholder="Correo"
        value={perfil.correo}
        onChange={(e) => handleChange("correo", e.target.value)}
        className="border rounded p-2"
      />

      <input
        type="text"
        placeholder="Teléfono"
        value={perfil.telefono}
        onChange={(e) => handleChange("telefono", e.target.value)}
        className="border rounded p-2"
      />

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
