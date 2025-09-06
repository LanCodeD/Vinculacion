import { PrismaClient } from "@prisma/client";

declare global {
  // Extiende el objeto global para que TypeScript reconozca `prisma`
  var prisma: PrismaClient | undefined;
}

// Configuración de logs según el entorno
const logOpciones =
  process.env.NODE_ENV === "production"
    ? ["error"] // Producción
    : ["query", "warn", "error", "info"]; //Desarrollo

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: logOpciones,
  });

// Evitar múltiples instancias en desarrollo (hot reload de Next.js)
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
