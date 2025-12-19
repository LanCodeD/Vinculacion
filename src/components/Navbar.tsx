"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";

interface UserProfile {
  id: number;
  nombre: string;
  apellido: string;
  rol: string;
  egresados?: { foto_perfil?: string }[];
  empresas?: { foto_perfil?: string }[];
  imagen_perfil?: string;
}

interface Notificacion {
  id_notificaciones: number;
  titulo: string;
  mensaje: string;
  url?: string;
  leido: boolean;
}

export default function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [hasUnread, setHasUnread] = useState(false); // ⚡ importante

  useEffect(() => {
    // Obtener sesión y usuario
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((sessionData) => {
        const userId = sessionData?.user?.id;
        if (!userId) return;

        fetch(`/api/Users/${userId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.rol === "Egresado" && data.egresados?.[0]?.foto_perfil) {
              const parts = data.egresados[0].foto_perfil.split("/");
              data.imagen_perfil = `/api/Usuarios/archivos/Perfiles/${encodeURIComponent(
                parts[parts.length - 1]
              )}`;
            } else if (data.rol === "Empresa" && data.empresas?.[0]?.foto_perfil) {
              const parts = data.empresas[0].foto_perfil.split("/");
              data.imagen_perfil = `/api/Usuarios/archivos/Perfiles/${encodeURIComponent(
                parts[parts.length - 1]
              )}`;
            }
            setUser(data);

            // Obtener notificaciones
            fetch(`/api/Notificaciones`)
              .then((res) => res.json())
              .then((data) => {
                if (data.ok) {
                  setNotificaciones(data.notificaciones);
                  setHasUnread(data.notificaciones.some((n: Notificacion) => !n.leido));
                }
              });
          });
      });
  }, []);

  const profileImage =
    user?.imagen_perfil ??
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div className="w-full h-[8ch] px-4 md:px-12 bg-zinc-50 shadow-md flex items-center justify-between">
      {/* Buscador */}
{/*       <div className="flex-1 max-w-[24rem] border border-zinc-300 rounded-full h-11 flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 h-full rounded-full outline-none border-none bg-zinc-50 px-4"
        />
        <button className="px-4 h-full flex items-center justify-center text-base text-zinc-600 border-l border-zinc-300">
          <FaSearch />
        </button>
      </div> */}

      {/* Notificaciones y perfil */}
      <div className="flex items-center gap-x-4 md:gap-x-8 relative text-black ml-auto">
        {/* Notificaciones */}
        <NotificationDropdown
          notifications={notificaciones}
          hasUnread={hasUnread}
          setHasUnread={setHasUnread} // ⚡ importante
        />

        {/* Perfil */}
        <div className="relative">
          <div
            className="w-11 h-11 rounded-full overflow-hidden border border-gray-300 cursor-pointer"
            onClick={() => setShowProfile(!showProfile)}
          >
            <Image
              src={profileImage}
              alt="Imagen de perfil"
              fill
              className="rounded-full object-cover object-center"
              unoptimized
              priority
            />
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link href="/MenuPrincipal/ConfiPerfil" className="block w-full h-full">
                    Mi perfil
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
