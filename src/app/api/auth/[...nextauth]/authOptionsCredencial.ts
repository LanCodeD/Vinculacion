import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma"; // tu instancia de prisma

export const authOptions: NextAuthOptions = {
  providers: [
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

        // Buscar usuario en DB
        const usuario = await prisma.usuarios.findUnique({
          where: { correo: credentials.correo },
        });

        if (!usuario) {
          throw new Error("Usuario no encontrado");
        }

        if (!usuario.password_hash) {
          throw new Error("El usuario no tiene contraseña configurada");
        }

        // Validar contraseña
        const isValid = await bcrypt.compare(
          credentials.password,
          usuario.password_hash
        );

        if (!isValid) {
          throw new Error("Credenciales inválidas");
        }

        // 🔹 Validaciones especiales según tipo de cuenta
        if (usuario.tipos_cuenta_id === 2) {
          // Egresado
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
          // Empresa
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

        // ✅ Si todo bien, devolver datos mínimos del usuario
        return {
          id: usuario.id_usuarios,
          nombre: usuario.nombre,
          correo: usuario.correo,
          tipoCuentaId: usuario.tipos_cuenta_id,
          roles_id: usuario.roles_id,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const usuario = user as User; // ✅ Ahora es tu User extendido
        token.id = usuario.id;
        token.nombre = usuario.nombre;
        token.correo = usuario.correo;
        token.tipoCuentaId = usuario.tipoCuentaId;
        token.roles_id = usuario.roles_id;
      }
      console.log("Este es el usuario logueado: ", token.nombre);
      console.log("Este es el correo logueado: ", token.correo);
      console.log("Este es el rol logueado: ", token.roles_id);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.nombre = token.nombre;
        session.user.correo = token.correo;
        session.user.tipoCuentaId = token.tipoCuentaId;
      }
      return session;
    },
  },
};
