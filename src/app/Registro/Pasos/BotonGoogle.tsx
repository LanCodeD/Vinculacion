"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

interface Props {
  texto?: string;
  tipoCuenta?: string;
}

export default function BotonGoogle({
  texto = "Continuar con Google",
  tipoCuenta,
}: Props) {
  const handleGoogle = () => {
    signIn("google", {
      callbackUrl: `/Registro?tipoCuenta=${tipoCuenta ?? ""}`,
    });
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
