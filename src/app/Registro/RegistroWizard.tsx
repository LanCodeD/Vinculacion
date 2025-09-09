"use client";

import React, { useState } from "react";
import type {
  DatosRegistro,
  DatosBasicos,
  PerfilEgresado,
  PerfilDocente,
  PerfilEmpresa,
} from "@/types/registro";

import PasoTipoCuenta from "./Pasos/PasoTipoCuenta";
import PasoDatosBasicos from "./Pasos/PasoDatosBasicos";
//import PasoVerificacion from "./Pasos/PasoVerificacion";
//import PasoPerfilEgresado from "./Pasos/PasoPerfilEgresado";
//import PasoPerfilDocente from "./Pasos/PasoPerfilDocente";
//import PasoPerfilEmpresa from "./Pasos/PasoPerfilEmpresa";
//import PasoFinal from "./Pasos/PasoFinal";

const initialRegistro: DatosRegistro = { tipoCuentaId: 0 };

export default function RegistroWizard() {
  const [registro, setRegistro] = useState<DatosRegistro>(initialRegistro);
  const [paso, setPaso] = useState<number>(1);

  const avanzar = () => setPaso((p) => p + 1);
  const retroceder = () => setPaso((p) => Math.max(1, p - 1));

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {paso === 1 && (
        <PasoTipoCuenta registro={registro} setRegistro={setRegistro} onNext={avanzar} />
      )}

      {paso === 2 && (
        <PasoDatosBasicos
          registro={registro}
          setRegistro={setRegistro}
          onNext={avanzar}
          onBack={retroceder}
        />
      )}

{/*       {paso === 3 && (
        <PasoVerificacion
          registro={registro}
          setRegistro={setRegistro}
          onNext={avanzar}
          onBack={retroceder}
        />
      )}

      {paso === 4 && registro.tipoCuentaId === 1 && (
        <PasoPerfilEgresado registro={registro} setRegistro={setRegistro} onNext={avanzar} onBack={retroceder} />
      )}

      {paso === 4 && registro.tipoCuentaId === 2 && (
        <PasoPerfilDocente registro={registro} setRegistro={setRegistro} onNext={avanzar} onBack={retroceder} />
      )}

      {paso === 4 && registro.tipoCuentaId === 3 && (
        <PasoPerfilEmpresa registro={registro} setRegistro={setRegistro} onNext={avanzar} onBack={retroceder} />
      )}

      {paso === 5 && <PasoFinal registro={registro} onBack={retroceder} />} */}
    </div>
  );
}
