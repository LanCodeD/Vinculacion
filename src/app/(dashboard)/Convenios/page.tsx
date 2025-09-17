"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  return session ? (
    <div>
      <p>Hola, {session.user?.name}</p>
      <p>Hola, {session.user?.email}</p>
      <p>Hola, {session.user?.image}</p>
      <button onClick={() => signOut()}>Cerrar sesión</button>
    </div>
  ) : (
    <button onClick={() => signIn("google")}>Ingresar con Google</button>
  );
}
