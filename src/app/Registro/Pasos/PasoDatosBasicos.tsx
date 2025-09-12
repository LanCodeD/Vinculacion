// src/app/Registro/Pasos/PasoDatosBasicos.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import type { DatosRegistro, DatosBasicos } from "@/types/registro";
import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

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

  async function handleSubmit() {
    // 1️⃣ Validación con Zod
    const result = schemaBase.safeParse(form);

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    // 2️⃣ Validar dominio institucional solo si tipoCuentaId === 1 (docentes)
    if (registro.tipoCuentaId === 1 && !regexInstitucional.test(form.correo)) {
      toast.error(
        "El correo debe pertenecer al dominio institucional Docente (Dominio del plantel)"
      );
      return;
    }

    // 3️⃣ Llamada al backend
    setLoading(true);
    try {
      const payload = {
        tipoCuentaId: registro.tipoCuentaId,
        datosBasicos: form,
      };

      const res = await axios.post("/api/Usuarios/registro-usuarios", payload);

      interface UsuarioResponse {
        id_usuarios?: number;
        usuarioId?: number;
        id?: number;
      }
      const data: UsuarioResponse = res.data;
      const usuarioId = data.id_usuarios ?? data.usuarioId ?? data.id ?? null;

      setRegistro((prev) => ({ ...prev, datosBasicos: form, usuarioId }));

      toast.success("Usuario creado con éxito");
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
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-sky-700 mb-6">
          Datos básicos
        </h2>

        <div className="grid grid-cols-1 gap-4 text-black">
          <input
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            placeholder="Nombre"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400"
          />
          <input
            value={form.apellido}
            onChange={(e) => handleChange("apellido", e.target.value)}
            placeholder="Apellido"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400"
          />
          <input
            value={form.correo}
            onChange={(e) => handleChange("correo", e.target.value)}
            placeholder="Correo"
            type="email"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400"
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Contraseña"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400"
          />
          <input
            value={form.celular}
            onChange={(e) => handleChange("celular", e.target.value)}
            placeholder="Celular"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            Atrás
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}
