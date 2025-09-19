// src/lib/authOptions.ts
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

// ⚡ Tu regex institucional
const regexInstitucional =
  /^(?=(?:[A-Za-z0-9.#+-][A-Za-z]){2,})(?!.*[.#+-]{2,})(?!^[.#+-])(?!.*[.#+-]$)[A-Za-z0-9._#+-]+@valladolid\.tecnm\.mx$/;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    /**
     * 🚀 Validación antes de permitir login
     */
    async signIn({ user, account }) {
      const rawUrl =
        (account?.["callbackUrl"] as string) ?? "http://localhost:3000";
      const url = new URL(rawUrl);
      const tipoCuenta = url.searchParams.get("tipoCuenta");
      console.log("Este es el tipo de cuenta en google: ",tipoCuenta)

      if (tipoCuenta === "1") {
        if (!user.email || !regexInstitucional.test(user.email)) {
          console.log("❌ Correo no válido para tipoCuenta=1");
          return false;
        }
      }

      return true;
    },

    async jwt({ token, account }) {
      const rawUrl = account?.["callbackUrl"] as string | undefined;
      if (rawUrl) {
        const tipoCuenta = new URL(rawUrl).searchParams.get("tipoCuenta");
        if (tipoCuenta) token.tipoCuenta = tipoCuenta;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.tipoCuenta) {
        session.user.tipoCuentaId = token.tipoCuentaId;
      }
      return session;
    },
  },
};
