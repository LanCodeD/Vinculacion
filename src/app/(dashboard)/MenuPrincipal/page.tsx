"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MenuPrincipalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
/* 
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/IniciarSesion");
    }
  }, [status]);

  if (status === "loading") return <div>Cargando...</div>; */

  return <div>Contenido protegido</div>;
}
