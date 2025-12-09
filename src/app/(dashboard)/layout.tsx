"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppRole } from "@/types/roles";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session?.user) {
    router.push("/");
    return null;
  }

  // 👇 Ya lo obtienes directo de la sesión
  const role = session.user.role as AppRole;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar role={role} />
      <div className="flex flex-col flex-1 min-h-0 bg-zinc-100">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto px-4 md:px-12 py-4">
          <Toaster position="top-right" />
          {children}
        </main>
      </div>
    </div>
  );
}
