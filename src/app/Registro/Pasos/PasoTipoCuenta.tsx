// src/app/Registro/Pasos/PasoTipoCuenta.tsx
"use client";
import React, { useEffect, useState } from "react";
import type { DatosRegistro } from "@/types/registro";
import type { Dispatch, SetStateAction } from "react";
import axios from "axios";

interface Props {
  registro: DatosRegistro;
  setRegistro: Dispatch<SetStateAction<DatosRegistro>>;
  onNext: () => void;
}

interface TipoCuenta {
  id_tipos_cuenta: number;
  nombre: string;
}

export default function PasoTipoCuenta({
  setRegistro,
  onNext,
}: Props) {
  const [tipos, setTipos] = useState<TipoCuenta[]>([]);

  useEffect(() => {
    axios.get("/api/Registro/tipos-cuenta").then((res) => setTipos(res.data));
  }, []);

  const elegir = (id: number) => {
    setRegistro((prev) => ({ ...prev, tipoCuentaId: id }));
    onNext();
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-linear-to-br from-sky-100 via-white to-sky-200">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-12 text-center drop-shadow-sm">
        ¿Qué tipo de cuenta desea crear?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 w-full max-w-6xl">
        {tipos.map((tipo) => (
          <button
            key={tipo.id_tipos_cuenta}
            onClick={() => elegir(tipo.id_tipos_cuenta)}
            className="h-40 flex items-center justify-center rounded-2xl bg-white shadow-lg border border-gray-200 
                     text-lg md:text-xl font-semibold text-gray-700 hover:shadow-2xl hover:scale-105 hover:bg-sky-50 
                     transition transform duration-200 ease-in-out"
          >
            {tipo.nombre}
          </button>
        ))}
      </div>

      <p className="mt-12 text-lg text-gray-700">
        Seleccione tipo de cuenta para continuar
      </p>
    </div>
  );
}
