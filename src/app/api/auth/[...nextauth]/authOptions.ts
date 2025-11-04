// src/app/api/auth/[...nextauth]/authOptions.ts
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions} from "next-auth";
import { ROLE_MAP, AppRole } from "@/types/roles";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma"; // tu instancia de Prisma

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
        if (!credentials?.correo || !credentials?.password) {
          throw new Error("Debe ingresar correo y contraseña");
        }

        //Buscar usuario usando el campo único 'correo'
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

        // Validaciones de verificación según tipo de cuenta
        if (usuario.tipos_cuenta_id === 2) {
          const egresado = await prisma.egresados.findFirst({
            where: { usuarios_id: usuario.id_usuarios },
          });
          if (!egresado?.verificado_por_usuarios_id || !egresado?.verificado_en) {
            throw new Error(
              "Tu cuenta de egresado aún no ha sido validada por un administrador."
            );
          }
        }

        if (usuario.tipos_cuenta_id === 3) {
          const empresa = await prisma.empresas.findFirst({
            where: { usuarios_id: usuario.id_usuarios },
          });
          if (!empresa?.verificado_por_usuarios_id || !empresa?.verificado_en) {
            throw new Error(
              "Tu cuenta de empresa aún no ha sido validada por un administrador."
            );
          }
        }

        // Retornar un objeto con los campos que luego usaremos en session y token
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
  pages: {
    signIn: "/IniciarSesion",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id); // asegúrate que sea número
        token.nombre = user.nombre;
        token.correo = user.correo;
        token.tipoCuentaId = Number(user.tipoCuentaId); // también a número
        token.roles_id = Number(user.roles_id); // forzar número
        token.role = ROLE_MAP[Number(user.roles_id)] ?? "Usuario";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = Number(token.id);
        session.user.nombre = token.nombre;
        session.user.correo = token.correo;
        session.user.tipoCuentaId = Number(token.tipoCuentaId);
        session.user.roles_id = Number(token.roles_id!);
        session.user.role = token.role as AppRole;
      }
      return session;
    },

  },
};
