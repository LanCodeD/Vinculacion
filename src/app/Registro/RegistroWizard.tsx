import React, { useState, useEffect } from "react";
import type {
  DatosRegistro,
  DatosBasicos,
  PerfilEgresado,
  PerfilDocente,
  PerfilEmpresa,
} from "@/types/registro";

import PasoTipoCuenta from "./Pasos/PasoTipoCuenta";
import PasoDatosBasicos from "./Pasos/PasoDatosBasicos";
import PasoVerificacion from "./Pasos/PasoVerificacion";
//import PasoPerfilEgresado from "./Pasos/PasoPerfilEgresado";
//import PasoPerfilDocente from "./Pasos/PasoPerfilDocente";
//import PasoPerfilEmpresa from "./Pasos/PasoPerfilEmpresa";
//import PasoFinal from "./Pasos/PasoFinal";

const initialRegistro: DatosRegistro = { tipoCuentaId: 0 };

export default function RegistroWizard() {
  const [registro, setRegistro] = useState<DatosRegistro>(initialRegistro);
  const [paso, setPaso] = useState<number>(1);

  // Funciones para avanzar y retroceder
  const avanzar = () => setPaso((p) => p + 1);
  const retroceder = () => setPaso((p) => Math.max(1, p - 1));

  // 🔹 Recuperar paso, usuarioId y tipoCuentaId de session/localStorage
  useEffect(() => {
    const pasoGuardado = Number(
      sessionStorage.getItem("registroPaso") ||
      localStorage.getItem("registroPaso") ||
      1
    );

    const usuarioIdGuardado = sessionStorage.getItem("registroUsuarioId") ||
      localStorage.getItem("registroUsuarioId") ||
      null;

    const tipoCuentaGuardado = sessionStorage.getItem("registroTipoCuenta") ||
      localStorage.getItem("registroTipoCuenta") ||
      null;

    setPaso(pasoGuardado);

    setRegistro((prev) => ({
      ...prev,
      usuarioId: usuarioIdGuardado ? Number(usuarioIdGuardado) : undefined,
      tipoCuentaId: tipoCuentaGuardado ? Number(tipoCuentaGuardado) : prev.tipoCuentaId,
    }));
  }, []);

  // 🔹 Guardar en session/localStorage cada vez que cambia el paso o tipoCuentaId
  useEffect(() => {
    sessionStorage.setItem("registroPaso", paso.toString());
    localStorage.setItem("registroPaso", paso.toString());

    if (registro.usuarioId) {
      sessionStorage.setItem("registroUsuarioId", registro.usuarioId.toString());
      localStorage.setItem("registroUsuarioId", registro.usuarioId.toString());
    }

    if (registro.tipoCuentaId) {
      sessionStorage.setItem("registroTipoCuenta", registro.tipoCuentaId.toString());
      localStorage.setItem("registroTipoCuenta", registro.tipoCuentaId.toString());
    }
  }, [paso, registro.usuarioId, registro.tipoCuentaId]);
  console.log("Recuperacion del paso UseEffects",paso)
  console.log("Recuperacion del usuario UseEffects",registro.usuarioId)
  console.log("Recuperacion del tipo cuenta UseEffects",registro.tipoCuentaId)

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

      {paso === 3 && (
        <PasoVerificacion
          registro={registro}
          setRegistro={setRegistro}
          onNext={avanzar}
          onBack={retroceder}
        />
      )}

     {/*  {paso === 4 && registro.tipoCuentaId === 1 && (
        <PasoPerfilEgresado
          registro={registro}
          setRegistro={setRegistro}
          onNext={avanzar}
          onBack={retroceder}
        />
      )}

      {paso === 4 && registro.tipoCuentaId === 2 && (
        <PasoPerfilDocente
          registro={registro}
          setRegistro={setRegistro}
          onNext={avanzar}
          onBack={retroceder}
        />
      )}

      {paso === 4 && registro.tipoCuentaId === 3 && (
        <PasoPerfilEmpresa
          registro={registro}
          setRegistro={setRegistro}
          onNext={avanzar}
          onBack={retroceder}
        />
      )}

      {paso === 5 && <PasoFinal registro={registro} onBack={retroceder} />} */}
    </div>
  );
}
