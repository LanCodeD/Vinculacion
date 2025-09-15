import React, { useState, useEffect } from "react";
import type { DatosRegistro } from "@/types/registro";

import PasoTipoCuenta from "./Pasos/PasoTipoCuenta";
import PasoDatosBasicos from "./Pasos/PasoDatosBasicos";
import PasoVerificacion from "./Pasos/PasoVerificacion";
import PasoPerfilEgresado from "./Pasos/PasoPerfilEgresado";
import PasoPerfilDocente from "./Pasos/PasoPerfilDocente";
import PasoPerfilEmpresa from "./Pasos/PasoPerfilEmpresa";
import PasoFinal from "./Pasos/PasoFinal";

const initialRegistro: DatosRegistro = { tipoCuentaId: 0 };

export default function RegistroWizard() {
  const [registro, setRegistro] = useState<DatosRegistro>(initialRegistro);
  const [paso, setPaso] = useState<number>(1);

  const avanzar = () => setPaso((p) => p + 1);
  const retroceder = () => setPaso((p) => Math.max(1, p - 1));

  // 🔹 Recuperar al montar (paso, usuarioId y tipoCuentaId)
  useEffect(() => {
    const pasoGuardado = Number(localStorage.getItem("registroPaso") || "1");
    const usuarioIdGuardado = localStorage.getItem("registroUsuarioId");
    const tipoCuentaGuardado = localStorage.getItem("registroTipoCuenta");

    setPaso(pasoGuardado);

    setRegistro((prev) => ({
      ...prev,
      usuarioId: usuarioIdGuardado ? Number(usuarioIdGuardado) : undefined,
      tipoCuentaId: tipoCuentaGuardado
        ? Number(tipoCuentaGuardado)
        : prev.tipoCuentaId,
    }));
  }, []);

  // 🔹 Guardar cada vez que cambie algo
  // 🔹 Limpieza al terminar el registro
  useEffect(() => {
    if (paso === 5) {
      localStorage.removeItem("registroPaso");
      localStorage.removeItem("registroUsuarioId");
      localStorage.removeItem("registroTipoCuenta");
      console.log("LOCALSTORAGE LIMPIADO");
      return;
    }

    // Guardar si no es paso final
    localStorage.setItem("registroPaso", paso.toString());
    console.log("localstorage de paso:", paso);
    if (registro.usuarioId) {
      localStorage.setItem("registroUsuarioId", registro.usuarioId.toString());

      console.log("localstorage de usuario:", registro.usuarioId);
    }
    if (registro.tipoCuentaId) {
      localStorage.setItem(
        "registroTipoCuenta",
        registro.tipoCuentaId.toString()
      );
      console.log("localstorage de tipo de cuenta:", registro.tipoCuentaId);
    }
  }, [paso, registro.usuarioId, registro.tipoCuentaId]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {paso === 1 && (
        <PasoTipoCuenta
          registro={registro}
          setRegistro={setRegistro}
          onNext={avanzar}
        />
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

      {paso === 4 && registro.tipoCuentaId === 1 && (
        <PasoPerfilDocente
          registro={registro}
          setRegistro={setRegistro}
          onNext={avanzar}
          onBack={retroceder}
        />
      )}

      {paso === 4 && registro.tipoCuentaId === 2 && (
        <PasoPerfilEgresado
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

      {paso === 5 && <PasoFinal registro={registro} onBack={retroceder} />}
    </div>
  );
}
