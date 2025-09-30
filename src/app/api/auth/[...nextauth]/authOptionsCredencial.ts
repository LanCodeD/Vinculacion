import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";
import { ROLE_MAP, AppRole } from "@/types/roles";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma"; // tu instancia de prisma

// Validación de entorno
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET no está definido en el entorno");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: { label: "Correo", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        try {
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

          // Validaciones por tipo de cuenta
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
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error en authorize:", error.message);
            throw new Error("Error de autenticación");
          } else {
            console.error("Error desconocido en authorize:", error);
            throw new Error("Error inesperado");
          }
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  // 👇 Le decimos a NextAuth qué rutas personalizadas usar
  pages: {
    signIn: "/IniciarSesion", // tu vista de login
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const usuario = user as User; // ✅ Ahora es tu User extendido
        token.id = usuario.id;
        token.nombre = usuario.nombre;
        token.correo = usuario.correo;
        token.tipoCuentaId = usuario.tipoCuentaId;
        token.roles_id = usuario.roles_id;
        token.role = ROLE_MAP[user.roles_id] ?? "Usuario";
      }
      if (process.env.NODE_ENV === "development") {
        console.log("Usuario logueado:", token.nombre);
        console.log("Correo logueado:", token.correo);
        console.log("Rol logueado:", token.roles_id);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.nombre = token.nombre;
        session.user.correo = token.correo;
        session.user.tipoCuentaId = token.tipoCuentaId;              // 👇 agrega rol en texto
        session.user.role = token.role as AppRole;
      }
      return session;
    },
  },
};
