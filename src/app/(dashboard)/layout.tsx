"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppRole } from "@/types/roles";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const role = session?.user?.role as AppRole | undefined;

  // 🚀 Redirecciones seguras dentro de useEffect
  useEffect(() => {
    if (status === "loading") return; // no hacer nada mientras carga

    if (!session?.user) {
      router.replace("/");
      return;
    }

    if (role === "Personal-Plantel") {
      router.replace("/Admin/Contactos");
    }
  }, [status, session, role, router]);

  // 🚀 Mientras carga la sesión, muestra un loader
  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  // 🚀 Si ya redirigió, no renderiza nada
  if (!session?.user || role === "Personal-Plantel") {
    return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar role={role!} />
      <div className="flex flex-col flex-1 min-h-0 bg-zinc-100">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 md:px-12 py-4">
          {children}
        </main>
      </div>
    </div>
  );
}
