import { DefaultSession, DefaultUser } from "next-auth";
import { AppRole } from "./roles";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      nombre: string;
      correo: string;
      tipoCuentaId: number;
      roles_id: number;
      role: AppRole;
      idGoogle?: string | null; // ✅ <-- nuevo
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number;
    nombre: string;
    correo: string;
    tipoCuentaId: number;
    roles_id: number;
    idGoogle?: string | null; // ✅ <-- nuevo
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    nombre: string;
    correo: string;
    tipoCuentaId: number;
    roles_id: number;
    role: AppRole;
    idGoogle?: string | null; // ✅ <-- nuevo
  }
}
