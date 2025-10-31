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

export default function PasoPerfilEmpresa({
  registro,
  setRegistro,
  onNext,
  onBack,
}: Props) {
  const perfil: PerfilEmpresa = registro.perfilEmpresa || {
    nombreComercial: "",
    razonSocial: "",
    rfc: "",
    direccion: "",
    correo: "",
    telefono: "",
    titulo: "",
    puesto: "",
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
      toast.error(
        "No se encontró el usuario. Completa primero los datos básicos."
      );
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
      titulo: perfil.titulo,
      puesto: perfil.puesto,
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
    <div className="w-full min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl">
        <h2 className="text-4xl font-extrabold text-center text-sky-700 mb-14 drop-shadow-sm">
          Perfil de Empresa
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 text-gray-800">
          {/* Título */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Título{" "}
              <span className="text-gray-400">(Ej. Lic., Ing., Mtro.)</span>
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
              Puesto{" "}
              <span className="text-gray-400">
                (Ej. Director General, Coordinador)
              </span>
            </label>
            <input
              type="text"
              value={perfil.puesto}
              onChange={(e) => handleChange("puesto", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400 transition"
              placeholder="Director General, Coordinador"
            />
          </div>

          {/* Nombre comercial */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Nombre comercial <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={perfil.nombreComercial}
              onChange={(e) => handleChange("nombreComercial", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400 transition"
              placeholder="Nombre de la empresa"
            />
          </div>

          {/* Razón social */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Razón social
            </label>
            <input
              type="text"
              value={perfil.razonSocial}
              onChange={(e) => handleChange("razonSocial", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400 transition"
              placeholder="Razón social de la empresa"
            />
          </div>

          {/* RFC */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              RFC <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={perfil.rfc}
              onChange={(e) => handleChange("rfc", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400 uppercase transition"
              placeholder="RFC de la empresa"
            />
          </div>

          {/* Teléfono */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="text"
              value={perfil.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400 transition"
              placeholder="Número de contacto"
            />
          </div>

          {/* Dirección */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Dirección
            </label>
            <input
              type="text"
              value={perfil.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400 transition"
              placeholder="Dirección completa"
            />
          </div>

          {/* Correo electrónico */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              value={perfil.correo}
              onChange={(e) => handleChange("correo", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400 transition"
              placeholder="ejemplo@empresa.com"
            />
          </div>
        </form>

        {/* Botones */}
        <div className="flex justify-between mt-12">
          <button
            onClick={onBack}
            className="px-8 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 transition"
          >
            Atrás
          </button>
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
