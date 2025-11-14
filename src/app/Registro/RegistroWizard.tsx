"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // 👈 para leer query params
import type { DatosRegistro } from "@/types/registro";

import PasoTipoCuenta from "./Pasos/PasoTipoCuenta";
import PasoDatosBasicos from "./Pasos/PasoDatosBasicos";
import PasoVerificacion from "./Pasos/PasoVerificacion";
import PasoPerfilEgresado from "./Pasos/PasoPerfilEgresado";
import PasoPerfilDocente from "./Pasos/PasoPerfilDocente";
import PasoPerfilEmpresa from "./Pasos/PasoPerfilEmpresa";
import PasoFinal from "./Pasos/PasoFinal";
import PasoAvisoPrivacidad from "./Pasos/PasoAvisoPrivacidad";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

const initialRegistro: DatosRegistro = { tipoCuentaId: 0 };

export default function RegistroWizard() {
  const searchParams = useSearchParams(); // 👈 leer query params
  const [registro, setRegistro] = useState<DatosRegistro>(initialRegistro);
  const [paso, setPaso] = useState<number>(1);

  const { data: session } = useSession();

  const avanzar = () => setPaso((p) => p + 1);
  const retroceder = () => setPaso((p) => Math.max(1, p - 1));

  useEffect(() => {
    // 🔹 Ver si viene tipoCuenta desde Google (ej: /Registro?tipoCuenta=1)
    const tipoCuentaFromUrl = searchParams.get("tipoCuenta");

    if (tipoCuentaFromUrl) {
      setRegistro((prev) => ({
        ...prev,
        tipoCuentaId: Number(tipoCuentaFromUrl),
      }));
      setPaso(4); // 👈 Brincamos directo al paso 4
      return; // ya no leemos localStorage
    }

    // 🔹 Si no viene de Google → seguimos usando lo del localStorage
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
  }, [searchParams]);

  // 🔹 Guardar en localStorage en cada cambio
  useEffect(() => {
    if (paso === 6) {
      localStorage.removeItem("registroPaso");
      localStorage.removeItem("registroUsuarioId");
      localStorage.removeItem("registroTipoCuenta");
      localStorage.removeItem("registroModo"); // 👈 añade esta línea
      console.log("LOCALSTORAGE LIMPIADO");
      return;
    }

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!session?.user?.email) return;
    if (registro.usuarioId) return;

    const completarRegistroGoogle = async () => {
      const tipo =
        Number(localStorage.getItem("registroTipoCuenta")) ||
        registro.tipoCuentaId;

      if (!tipo) {
        toast.error("No se encontró el tipo de cuenta seleccionado.");
        return;
      }

      try {
        const res = await axios.post("/api/Usuarios/google-complete", {
          tipoCuentaId: tipo,
          correo: session.user.email,
          providerAccountId: session.user.idGoogle ?? null,
        });

        const id = res.data.id_usuarios ?? res.data.id;

        if (id) {
          setRegistro((prev) => ({
            ...prev,
            usuarioId: id,
            tipoCuentaId: tipo,
          }));

          toast.success(
            "Registro completado con Google. Avanzando al perfil..."
          );
          setPaso(4);
        }
      } catch (err) {
        toast.error("Error al completar registro.");
      }
    };

    completarRegistroGoogle();
  }, [session]);

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

      {paso === 5 && (
        <PasoAvisoPrivacidad
          onNext={avanzar} // Avaza al paso final
          onBack={retroceder} // Puede volver al paso anterior si quiere
        />
      )}

      {paso === 6 && <PasoFinal registro={registro} onBack={retroceder} />}
    </div>
  );
}
