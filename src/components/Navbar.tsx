"use client";

import React, { useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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

      {/* Notificaciones + Perfil */}
          {/* Notificaciones y perfil */}
          <div className="flex items-center gap-x-4 md:gap-x-8 ml-2 relative text-black">

            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) setShowProfile(false); // cierra perfil si se abre notificaciones
                }}
                className="relative focus:outline-none"
              >
                {/* Ping effect */}
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600"></span>
                </span>
                <FaBell className="text-xl text-black" />
              </button>

              {/* Dropdown de notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <div className="p-3 border-b font-semibold">Notificaciones</div>
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Noti 1</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Noti 2</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Noti 3</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Perfil */}
            <div className="relative">
              <img
                src="https://cdn.pixabay.com/photo/2016/11/21/11/17/model-1844729_640.jpg"
                alt="profile"
                className="w-11 h-11 rounded-full object-cover object-center cursor-pointer"
                onClick={() => {
                  setShowProfile(!showProfile);
                  if (!showProfile) setShowNotifications(false); // cierra notificaciones si se abre perfil
                }}
              />

              {/* Dropdown de perfil */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Mi perfil</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Configuración</li>
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
