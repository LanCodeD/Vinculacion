"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MenuPrincipalPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-black">Bienvenido al Menú Principal</h1>
      <p className="text-black">Este es el contenido de la página.</p>
    </div>
  );
}
