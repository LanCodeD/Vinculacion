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
    // Guardar datos para RegistroWizard (opcional, pero útil)
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
      const callbackUrl =
        modo === "registro"
          ? `/Registro?from=google&tipoCuenta=${tipoCuenta ?? ""}`
          : `/MenuPrincipal`; // o "/" si prefieres

      // redirige directamente a la URL adecuada
      await signIn("google", {
        callbackUrl,
        redirect: true,
        prompt: "select_account",
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
