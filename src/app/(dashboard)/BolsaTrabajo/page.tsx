"use client";
import React from "react";
import { signOut } from "next-auth/react";

export default function BolsaTrabajo() {
  return (
    <div>
      <div className="min-h-screen text-3xl text-black bg-amber-50">
        Felicidades, te haz logueado
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}