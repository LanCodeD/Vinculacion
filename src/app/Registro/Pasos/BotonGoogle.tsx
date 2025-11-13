"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

interface Props {
  texto?: string;
  tipoCuenta?: number;
  modo?: "registro" | "login";
}

export default function BotonGoogle({
  texto = "Continuar con Google",
  tipoCuenta,
  modo = "registro",
}: Props) {
  const handleGoogle = async () => {
    // Guardar datos para el RegistroWizard
    if (modo === "registro") {
      localStorage.setItem("registroModo", modo);
      localStorage.setItem("registroTipoCuenta", String(tipoCuenta ?? ""));
    } else {
      localStorage.removeItem("registroModo");
    }

    const toastId = toast.loading("Conectando con Google...", {
      duration: 10000,
      position: "top-right",
    });

    try {
      await signIn("google", {
        callbackUrl: "/Registro?from=google",
        redirect: true,
        prompt: "select_account", // 👈 muestra selector + mensaje de permisos
      });
    } catch (err) {
      console.error("Error signIn google:", err);
      toast.error("Error al conectar con Google.");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <button
      onClick={handleGoogle}
      className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
    >
      <FcGoogle className="w-5 h-5" />
      {texto}
    </button>
  );
}
