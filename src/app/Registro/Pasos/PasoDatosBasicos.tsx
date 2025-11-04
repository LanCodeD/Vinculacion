// src/app/Registro/Pasos/PasoDatosBasicos.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import type { DatosRegistro, DatosBasicos } from "@/types/registro";
import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
//import BotonGoogle from "./BotonGoogle";

interface Props {
  registro: DatosRegistro;
  setRegistro: Dispatch<SetStateAction<DatosRegistro>>;
  onNext: () => void;
  onBack: () => void;
}

// ⚡ Expresión regular para validar dominio institucional
const regexInstitucional =
  /^(?=(?:[A-Za-z0-9.#+-][A-Za-z]){2,})(?!.*[.#+-]{2,})(?!^[.#+-])(?!.*[.#+-]$)[A-Za-z0-9._#+-]+@valladolid\.tecnm\.mx$/;

// ⚡ Esquema de validación base (sin dominio aún)
const schemaBase = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  correo: z.string().email("El correo no es válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  celular: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: "El celular debe tener 10 dígitos numéricos",
    }),
});

export default function PasoDatosBasicos({
  registro,
  setRegistro,
  onNext,
  onBack,
}: Props) {
  const initial: DatosBasicos = registro.datosBasicos ?? {
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    celular: "",
  };

  const [form, setForm] = useState<DatosBasicos>(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (registro.datosBasicos) setForm(registro.datosBasicos);
  }, [registro.datosBasicos]);

  function handleChange<K extends keyof DatosBasicos>(
    field: K,
    value: DatosBasicos[K]
  ) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  const handleSubmit = async () => {
    const result = schemaBase.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    if (registro.tipoCuentaId === 1 && !regexInstitucional.test(form.correo)) {
      toast.error("El correo debe pertenecer al dominio institucional Docente");
      return;
    }

    setLoading(true);
    try {
      let usuarioId = registro.usuarioId;

      if (usuarioId) {
        // 🔹 Ya existe → actualizar
        await axios.patch(`/api/Usuarios/registro-usuarios/${usuarioId}`, form);
        toast.success("Datos actualizados con éxito");
        console.log("Estamos en el PATCH endpoint");
      } else {
        // 🔹 No existe → crear
        const payload = {
          tipoCuentaId: registro.tipoCuentaId,
          datosBasicos: form,
        };
        const res = await axios.post(
          "/api/Usuarios/registro-usuarios",
          payload
        );

        usuarioId = res.data.id_usuarios ?? res.data.usuarioId ?? res.data.id;
        toast.success("Usuario creado con éxito");
        console.log("Estamos en el POST endpoint");
      }

      setRegistro((prev) => ({ ...prev, datosBasicos: form, usuarioId }));
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
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-sky-100 via-white to-sky-50 px-6 py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-sky-100 p-12">
        <h2 className="text-3xl font-bold text-center text-sky-700 mb-10">
          Datos básicos
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Nombre
            </label>
            <input
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              placeholder="Ingresa tu nombre"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder:text-gray-400 transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Apellido
            </label>
            <input
              value={form.apellido}
              onChange={(e) => handleChange("apellido", e.target.value)}
              placeholder="Ingresa tu apellido"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder:text-gray-400 transition-all"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={form.correo}
              onChange={(e) => handleChange("correo", e.target.value)}
              placeholder="ejemplo@correo.com"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder:text-gray-400 transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="********"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder:text-gray-400 transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Celular
            </label>
            <input
              value={form.celular}
              onChange={(e) => handleChange("celular", e.target.value)}
              placeholder="Número de celular"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder:text-gray-400 transition-all"
            />
          </div>
        </form>

        <div className="flex justify-between items-center mt-10">
          <button
            onClick={onBack}
            className="px-8 py-3 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-800 transition"
          >
            Atrás
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-sky-600 text-white rounded-lg font-semibold shadow-md hover:bg-sky-700 transition transform hover:scale-[1.03] disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Continuar"}
          </button>
        </div>
        {/* Si luego quieres agregar Google */}
        {/* <div className="mt-6 text-center">
        <BotonGoogle
          texto="Registrarse con Google"
          tipoCuenta={registro.tipoCuentaId?.toString()}
        />
      </div> */}
      </div>
    </div>
  );
}
