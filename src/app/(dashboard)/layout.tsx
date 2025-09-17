import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 min-h-0 bg-zinc-100">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 md:px-12 py-4">
          {children}
        </main>
      </div>
    </div>
  );
}
