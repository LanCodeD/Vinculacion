// app/(dashboard)/layout.tsx
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AppRole } from "@/types/roles";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🚀 Obtener sesión directamente en el servidor
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/"); // Redirige sin parpadeos
  }

  const role = session.user.role as AppRole;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ✅ Ya no hay retraso en obtener el rol */}
      <Sidebar role={role} />
      <div className="flex flex-col flex-1 min-h-0 bg-zinc-100">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 md:px-12 py-4">
          {children}
        </main>
      </div>
    </div>
  );
}
