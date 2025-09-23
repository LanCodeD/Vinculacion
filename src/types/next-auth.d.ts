import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      nombre: string;
      correo: string;
      tipoCuentaId: number;
      roles_id: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number;
    nombre: string;
    correo: string;
    tipoCuentaId: number;
    roles_id: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    nombre: string;
    correo: string;
    tipoCuentaId: number;
    roles_id: number;
  }
}
