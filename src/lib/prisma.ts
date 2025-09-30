import { PrismaClient, Prisma } from "@prisma/client";

declare global {
  // Extiende el objeto global para que TypeScript reconozca `prisma`
  var prisma: PrismaClient | undefined;
}

// Configuración de logs según el entorno
const logOpciones: Prisma.LogDefinition[] =
  process.env.NODE_ENV === "production"
    ? [{ emit: "stdout", level: "error" }]//produccion
    : [
        { emit: "stdout", level: "query" },//desarrollo
        { emit: "stdout", level: "warn" },
        { emit: "stdout", level: "error" },
        { emit: "stdout", level: "info" },
      ];


export const prisma =
  global.prisma ||
  new PrismaClient({
    log: logOpciones,
  });

// Evitar múltiples instancias en desarrollo (hot reload de Next.js)
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
