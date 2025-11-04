"use client";

import React, { useState, useEffect } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface UserProfile {
  id: number;
  nombre: string;
  apellido: string;
  rol: string;
  egresados?: {
    foto_perfil?: string;
  }[];
  empresas?: {
    foto_perfil?: string;
  }[];
  imagen_perfil?: string;
}

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Obtener id de sesión desde el backend o sesión de next-auth
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((sessionData) => {
        const userId = sessionData?.user?.id;
        if (!userId) return;

        // Obtener datos del usuario
        fetch(`/api/Users/${userId}`)
          .then((res) => res.json())
          .then((data) => {
            // Ajustar imagen de perfil
            if (data.rol === "Egresado" && data.egresados?.[0]?.foto_perfil) {
              const parts = data.egresados[0].foto_perfil.split("/");
              data.imagen_perfil = `/api/Usuarios/archivos/Perfiles/${encodeURIComponent(
                parts[parts.length - 1]
              )}`;
            } else if (
              data.rol === "Empresa" &&
              data.empresas?.[0]?.foto_perfil
            ) {
              const parts = data.empresas[0].foto_perfil.split("/");
              data.imagen_perfil = `/api/Usuarios/archivos/Perfiles/${encodeURIComponent(
                parts[parts.length - 1]
              )}`;
            }
            setUser(data);
          })
          .catch((err) => console.error("Error al obtener usuario:", err));
      })
      .catch((err) => console.error("Error al obtener sesión:", err));
  }, []);

  const profileImage =
    user?.imagen_perfil ??
    "https://cdn.pixabay.com/photo/2016/11/21/11/17/model-1844729_640.jpg";

  return (
    <div className="w-full h-[8ch] px-4 md:px-12 bg-zinc-50 shadow-md flex items-center justify-between">
      {/* Buscador */}
      <div className="flex-1 max-w-[24rem] border border-zinc-300 rounded-full h-11 flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 h-full rounded-full outline-none border-none bg-zinc-50 px-4"
        />
        <button className="px-4 h-full flex items-center justify-center text-base text-zinc-600 border-l border-zinc-300">
          <FaSearch />
        </button>
      </div>

      {/* Notificaciones y perfil */}
      <div className="flex items-center gap-x-4 md:gap-x-8 ml-2 relative text-black">
        {/* Notificaciones */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) setShowProfile(false);
            }}
            className="relative focus:outline-none"
          >
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600"></span>
            </span>
            <FaBell className="text-xl text-black" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-50">
              <div className="p-3 border-b font-semibold">Notificaciones</div>
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Noti 1
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Noti 2
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Noti 3
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Perfil */}
        <div className="relative">
          <Image
            src={profileImage}
            alt="Imagen de perfil"
            width={44}
            height={44}
            className="rounded-full object-cover object-center cursor-pointer"
            onClick={() => {
              setShowProfile(!showProfile);
              if (!showProfile) setShowNotifications(false);
            }}
            priority
          />

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Mi perfil
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Configuración
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
