import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, User } from "next-auth";
import { ROLE_MAP, AppRole } from "@/types/roles";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import type { Account } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { Profile } from "next-auth";

// 🧩 Validación de entorno
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET no está definido en el entorno");
}

export const authOptions: NextAuthOptions = {
  providers: [
    // 🔹 Login clásico (correo + contraseña)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: { label: "Correo", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.correo || !credentials?.password) {
          throw new Error("Debe ingresar correo y contraseña");
        }

        const usuario = await prisma.usuarios.findUnique({
          where: { correo: credentials.correo },
        });

        if (!usuario || !usuario.password_hash) {
          throw new Error("Usuario o contraseña inválidos");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          usuario.password_hash
        );

        if (!isValid) {
          throw new Error("Usuario o contraseña inválidos");
        }

        // 🧱 Validaciones por tipo de cuenta
        if (usuario.tipos_cuenta_id === 2) {
          const egresado = await prisma.egresados.findFirst({
            where: { usuarios_id: usuario.id_usuarios },
          });

          if (
            !egresado ||
            !egresado.verificado_por_usuarios_id ||
            !egresado.verificado_en
          ) {
            throw new Error(
              "Tu cuenta de egresado aún no ha sido validada por un administrador."
            );
          }
        }

        if (usuario.tipos_cuenta_id === 3) {
          const empresa = await prisma.empresas.findFirst({
            where: { usuarios_id: usuario.id_usuarios },
          });

          if (
            !empresa ||
            !empresa.verificado_por_usuarios_id ||
            !empresa.verificado_en
          ) {
            throw new Error(
              "Tu cuenta de empresa aún no ha sido validada por un administrador."
            );
          }
        }

        return {
          id: usuario.id_usuarios,
          nombre: usuario.nombre,
          correo: usuario.correo,
          tipoCuentaId: usuario.tipos_cuenta_id,
          roles_id: usuario.roles_id,
        };
      },
    }),

    // 🔹 Login con Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/IniciarSesion",
  },

  callbacks: {
    // dentro de authOptions.callbacks
    async signIn({
      user,
      account,
    }: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, unknown>;
    }) {
      if (account?.provider === "google") {
        const correo = user?.email ?? "";
        if (!correo) {
          return "/IniciarSesion?error=No se pudo obtener el correo de Google.";
        }

        const usuarioDB = await prisma.usuarios.findUnique({
          where: { correo },
        });

        if (usuarioDB) {
          if (usuarioDB.tipos_cuenta_id === 2) {
            const egresado = await prisma.egresados.findFirst({
              where: { usuarios_id: usuarioDB.id_usuarios },
            });
            if (
              !egresado ||
              !egresado.verificado_por_usuarios_id ||
              !egresado.verificado_en
            ) {
              return "/IniciarSesion?error=Tu cuenta de egresado no ha sido validada por un administrador.";
            }
          }

          if (usuarioDB.tipos_cuenta_id === 3) {
            const empresa = await prisma.empresas.findFirst({
              where: { usuarios_id: usuarioDB.id_usuarios },
            });
            if (
              !empresa ||
              !empresa.verificado_por_usuarios_id ||
              !empresa.verificado_en
            ) {
              return "/IniciarSesion?error=Tu cuenta de empresa no ha sido validada por un administrador.";
            }
          }

          return true;
        }

        // Si no existe en BD → permitir registro
        return true;
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (process.env.NODE_ENV === "development") {
        console.log("[jwt] usuario:", user);
        console.log("[jwt] cuenta:", account);
        console.log("🟠 [jwt] before merge:", token);
      }

      if (account?.provider === "google") {
        token.idGoogle = account.providerAccountId;
      }

      if (user) {
        // 🧩 Obtener correo según el tipo de provider
        const correoUsuario = user.email ?? user.correo;

        if (!correoUsuario) {
          console.warn("⚠️ No se encontró correo en user:", user);
          return token;
        }

        const usuario = await prisma.usuarios.findUnique({
          where: { correo: correoUsuario },
        });

        if (usuario) {
          token.id = usuario.id_usuarios;
          token.nombre = usuario.nombre;
          token.correo = usuario.correo;
          token.tipoCuentaId = usuario.tipos_cuenta_id;
          token.roles_id = usuario.roles_id;
          token.role = ROLE_MAP[usuario.roles_id] ?? "Usuario";
        }

        if (process.env.NODE_ENV === "development") {
          console.log("Usuario logueado:", token.nombre ?? "Desconocido");
          console.log("Correo logueado:", token.correo ?? "Desconocido");
          console.log("Rol logueado:", token.roles_id ?? "N/A");
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.nombre = token.nombre;
        session.user.correo = token.correo;
        session.user.tipoCuentaId = token.tipoCuentaId;
        session.user.roles_id = token.roles_id!;
        session.user.role = token.role as AppRole;
        session.user.idGoogle = token.idGoogle;
      }
      return session;
    },
  },
};
