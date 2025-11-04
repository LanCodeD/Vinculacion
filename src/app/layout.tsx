import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "./SessionWrapper";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

// 🧩 Importa el cron job
import "@/cron/actualizarEstadoConvenios";

export const metadata: Metadata = {
  title: "Sistema de Convenios",
  description: "Gestión de convenios empresariales",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es">
      <body>
        <Toaster position="top-right" />
        <SessionWrapper session={session}>{children}</SessionWrapper>
      </body>
    </html>
  );
}
