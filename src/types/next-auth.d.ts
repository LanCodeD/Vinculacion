import { DefaultSession, DefaultUser } from "next-auth";
import { AppRole } from "./roles";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      nombre: string;
      apellido: string;
      correo: string;
      tipoCuentaId: number | null;   // ✔ ahora permite null
      roles_id: number | null;       // ✔ ahora permite null
      role: AppRole;
      idGoogle?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    tipoCuentaId: number | null;    // ✔ correcto
    roles_id: number | null;        // ✔ correcto
    idGoogle?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    tipoCuentaId: number | null;   // ✔ ahora permite null
    roles_id: number | null;       // ✔ ahora permite null
    role: AppRole;
    idGoogle?: string | null;
  }
}
