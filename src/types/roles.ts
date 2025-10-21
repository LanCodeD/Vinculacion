// utils/roles.ts
export type AppRole =
  | "Docente"
  | "Egresado"
  | "Empresa"
  | "Administrador"
  | "Sub-Administrador"
  | "Personal-Plantel"; // 👈 aquí defines los nombres de los 6 roles

export const ROLE_MAP: Record<number, AppRole> = {
  1: "Docente",
  2: "Egresado",
  3: "Empresa",
  4: "Administrador",
  5: "Sub-Administrador",
  6: "Personal-Plantel",
};
