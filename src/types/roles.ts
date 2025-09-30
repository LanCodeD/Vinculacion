// utils/roles.ts
export type AppRole =
  | "Usuario"
  | "Supervisor"
  | "Editor"
  | "Administrador"
  | "Invitado"
  | "Root"; // 👈 aquí defines los nombres de los 6 roles

export const ROLE_MAP: Record<number, AppRole> = {
  1: "Usuario",
  2: "Supervisor",
  3: "Editor",
  4: "Administrador",
  5: "Invitado",
  6: "Root",
};
