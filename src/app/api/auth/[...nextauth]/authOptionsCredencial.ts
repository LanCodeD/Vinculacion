import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, User } from "next-auth";
import { ROLE_MAP, AppRole } from "@/types/roles";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import type { Account } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { Profile } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

type ExtendedUser = User & { correo?: string };
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

      profile(profile) {
        return {
          id: profile.sub, // NextAuth requiere "id"
          idGoogle: profile.sub, // <-- nuestro idGoogle correcto
          nombre: profile.given_name,
          apellido: profile.family_name,
          email: profile.email,
          correo: profile.email, // por compatibilidad con tu BD
          image: profile.picture,

          tipoCuentaId: null, // requerido por tu interfaz User
          roles_id: null, // requerido por tu interfaz User
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/IniciarSesion",
  },

  callbacks: {
    // signIn: mantenemos la firma que NextAuth espera

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
      // tipito local para tratar account con propiedades extras (Google)
      type MaybeGoogleAccount = Account & {
        provider?: string;
        providerAccountId?: string;
        callbackUrl?: string;
        state?: string;
        params?: Record<string, string>;
      };

      const googleAccount = account as MaybeGoogleAccount | null;

      if (googleAccount?.provider === "google") {
        const correo =
          (user as ExtendedUser)?.email ?? (user as ExtendedUser)?.correo ?? "";

        if (!correo) {
          return "/IniciarSesion?error=No se pudo obtener el correo de Google.";
        }

        // Buscar usuario por correo
        const usuarioDB = await prisma.usuarios.findUnique({
          where: { correo },
        });

        if (usuarioDB) {
          // intentar sincronizar providerAccountId si hace falta (no rompe flujo on error)
          try {
            const providerId = googleAccount.providerAccountId;
            if (providerId) {
              const hasProviderAccount = await prisma.accounts.findFirst({
                where: { provider: "google", providerAccountId: providerId },
              });

              if (!hasProviderAccount) {
                // actualizar posibles legacy accounts que guardaban correo en providerAccountId
                await prisma.accounts.updateMany({
                  where: {
                    usuarios_id: usuarioDB.id_usuarios,
                    provider: "google",
                    providerAccountId: { contains: "@" }, // heurístico
                  },
                  data: { providerAccountId: providerId },
                });
              }
            }
          } catch (syncErr) {
            console.warn("Error sincronizando providerAccountId:", syncErr);
          }

          // Validaciones por tipo de cuenta (egresado / empresa)
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

          // usuario existe y pasó validaciones → permitir
          return true;
        }

        // usuario NO existe → permitir para que el frontend complete registro
        return true;
      }

      // provider distinto de Google -> permitir (o añade lógica para Credentials si quieres)
      return true;
    },

    // jwt: construir token con idGoogle (string) de manera segura
    async jwt({ token, user }) {
      if (process.env.NODE_ENV === "development") {
        console.log("[jwt] usuario:", user);
        console.log("🟠 [jwt] before merge:", token);
      }

      // 1. Si el provider trae idGoogle desde profile(), usarlo SIEMPRE
      if (user?.idGoogle) {
        token.idGoogle = String(user.idGoogle);
      }

      // 2. Si no, intentar sacarlo de user.id (adapter) y forzar a string
      if (!token.idGoogle && user?.id != null) {
        token.idGoogle = String(user.id);
      }

      // 3. Merge con datos de BD
      if (user) {
        const correoUsuario =
          (user as ExtendedUser)?.email ?? (user as ExtendedUser)?.correo;

        if (correoUsuario) {
          try {
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
          } catch (err) {
            console.warn("Error consultando usuario en jwt callback:", err);
          }
        }
      }

      return token;
    },

    // session: exponer idGoogle (string|null) en session.user.idGoogle
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.nombre = token.nombre;
        session.user.correo = token.correo;
        session.user.tipoCuentaId = token.tipoCuentaId;
        session.user.roles_id = token.roles_id ?? null;
        session.user.role = token.role as AppRole;
        session.user.idGoogle = token.idGoogle ?? null; // ya forzado a string arriba
      }
      return session;
    },
  },
};
