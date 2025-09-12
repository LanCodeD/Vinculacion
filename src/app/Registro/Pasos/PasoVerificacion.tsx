"use client";

import React, { useState, useRef } from "react";
import type { DatosRegistro } from "@/types/registro";
import type { Dispatch, SetStateAction } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  registro: DatosRegistro;
  setRegistro: Dispatch<SetStateAction<DatosRegistro>>;
  onNext: () => void;
  onBack: () => void;
}

export default function PasoVerificacion({
  registro,
  setRegistro,
  onNext,
  onBack,
}: Props) {
  const [codigo, setCodigo] = useState(Array(6).fill("")); // 6 casillas
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [cooldown, setCooldown] = useState(0); // segundos de espera
  const [reenvios, setReenvios] = useState(0); // Número de reenvíos hechos

  console.log("Datos actuales de Verificacion:", registro);
  function handleChange(index: number, value: string) {
    if (/^[0-9]?$/.test(value)) {
      const nuevo = [...codigo];
      nuevo[index] = value;
      setCodigo(nuevo);

      // Avanzar automáticamente al siguiente input
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  }

  async function handleSubmit() {
    const codigoVerificacion = codigo.join("");

    if (codigoVerificacion.length !== 6) {
      toast.error("El código debe tener 6 dígitos");
      return;
    }

    try {
      const payload = {
        usuarioId: registro.usuarioId,
        codigoVerificacion,
      };

      const res = await axios.post("/api/Registro/verificar-codigo", payload);

      toast.success("Correo verificado con éxito");
      setRegistro((prev) => ({
        ...prev,
        verificacion: { codigoVerificacion },
      }));
      onNext();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? "Error en el servidor");
      } else {
        toast.error("Error inesperado");
      }
    }
  }

  async function handleReenviar() {
    if (cooldown > 0) return; // seguridad extra

    try {
      await axios.post("/api/Registro/reenviar-codigo", {
        usuarioId: registro.usuarioId,
      });

      toast.success("Se envió un nuevo código al correo");

      // Incrementar contador de reenvíos
      const nuevosReenvios = reenvios + 1;
      setReenvios(nuevosReenvios);

      // Cooldown progresivo: 30s, 60s, 120s
      let tiempoCooldown = 30;
      if (nuevosReenvios === 2) tiempoCooldown = 60;
      else if (nuevosReenvios >= 3) tiempoCooldown = 120;

      setCooldown(tiempoCooldown);

      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? "Error en el servidor");
      } else {
        toast.error("Error inesperado");
      }
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Verificación de correo
      </h2>
      <p className="mb-8 text-gray-600 text-center max-w-md">
        Hemos enviado un código de verificación a{" "}
        <span className="font-semibold">{registro.datosBasicos?.correo}</span>.
        Ingrese el código de 6 dígitos para continuar.
      </p>

      <div className="flex space-x-3 mb-6">
        {codigo.map((digito, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            maxLength={1}
            value={digito}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-12 h-12 text-center border rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
      >
        Verificar
      </button>
      <button onClick={onBack} className="mt-4 text-gray-500">
        Atrás
      </button>

      <button
        onClick={handleReenviar}
        disabled={cooldown > 0}
        className={`mt-4 ${
          cooldown > 0
            ? "text-gray-400 cursor-not-allowed"
            : "text-emerald-600 hover:underline"
        }`}
      >
        {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar código"}
      </button>
    </div>
  );
}
