import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    tipoCuenta?: string;
  }

  interface User extends DefaultUser {
    tipoCuenta?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tipoCuenta?: string;
  }
}
