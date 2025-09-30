import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const pathname = req.nextUrl.pathname;

    // 🔒 Si no hay token y no está en login → redirigir
    if (!token && pathname !== "/IniciarSesion") {
      return NextResponse.redirect(new URL("/IniciarSesion", req.url));
    }

    // 🔐 Restricciones por rol
    if (token) {
      const rol = token.roles_id;

      // Área Admin → solo rol 1
      if (pathname.startsWith("/admin") && rol !== 1) {
        return NextResponse.redirect(new URL("/PaginaNoAutorizada", req.url));
      }

      // Área Empresa → solo rol 3
      if (pathname.startsWith("/empresa") && rol !== 3) {
        return NextResponse.redirect(new URL("/PaginaNoAutorizada", req.url));
      }

      // Área Egresado → solo rol 2
      if (pathname.startsWith("/egresado") && rol !== 2) {
        return NextResponse.redirect(new URL("/PaginaNoAutorizada", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // true si hay sesión
    },
  }
);

export const config = {
  matcher: [
    "/MenuPrincipal/:path*", // Dashboard general
    "/admin/:path*",
    "/empresa/:path*",
    "/egresado/:path*",
  ],
};
