"use client";

import React, { useState } from "react";
import { BiChat } from "react-icons/bi";
import { FaBell, FaSearch, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
import { FiTable } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import { MdOutlineHeadsetMic, MdSpaceDashboard } from "react-icons/md";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { TiCalendar } from "react-icons/ti";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [subMenus, setSubMenus] = useState<{ [key: string]: boolean }>({
    inbox: false,
    settings: false,
  });

  const toggleSubMenu = (menu: string) => {
    setSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const Menus = [
    { title: "Dashboard", icon: <MdSpaceDashboard /> },
    {
      title: "Servicios",
      icon: <BiChat />,
      gap: true,
      subMenu: ["Convenios", "Bolsa de trabajo"],
      key: "servicios",
    },
    { title: "Calendar", icon: <TiCalendar /> },
    { title: "Tables", icon: <FiTable /> },
    { title: "Analytics", icon: <GoGraph /> },
    { title: "Support", icon: <MdOutlineHeadsetMic /> },
    {
      title: "Setting",
      icon: <FaGears />,
      subMenu: ["General", "Notifications"],
      key: "settings",
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar para desktop */}
      <div
        className={`hidden md:flex flex-col ${open ? "w-72 p-5" : "w-20 p-4"
          } bg-zinc-900 h-full pt-8 relative duration-300 ease-in-out `}
      >
        
        {/* Toggle button */}
        <div
          className={`absolute cursor-pointer -right-4 top-9 w-8 h-8 p-0.5 bg-zinc-50 border-zinc-50 border-2 rounded-full text-xl flex items-center justify-center ${!open && "rotate-180"
            } transition-all ease-in-out duration-300`}
          onClick={() => {
            if (open) {
              // 🔒 Si lo estás cerrando, colapsa todos los submenús
              setSubMenus({});
            }
            setOpen(!open);
          }}
        >
          {open ? <TbLayoutSidebarLeftExpand /> : <TbLayoutSidebarLeftCollapse />}
        </div>

        {/* Logo */}
        <div className="flex gap-x-4 items-center">
          <img
            src="/Dashboard/logoitsva.webp"
            alt="logo"
            className={`w-10 h-10 md:w-12 md:h-12 lg:w-13 lg:h-13 rounded-full object-cover object-center cursor-pointer transition-transform duration-300 ease-in-out 
  hover:scale-110 
  ${open && "rotate-[360deg]"}`}
          />
          <h1
            className={`text-zinc-50 origin-left font-semibold text-xl duration-200 ease-in-out ${!open && "scale-0"
              }`}
          >
            SISTEMA DE BOLSA
          </h1>
        </div>

        {/* Sidebar Menus */}
        <ul className="pt-6 space-y-0.5">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex flex-col rounded-md py-3 px-4 cursor-pointer hover:text-white text-zinc-50 hover:bg-blue-800/50 transition-all ease-in-out duration-300 ${Menu.gap ? "mt-9" : "mt-2"
                } ${index === 0 && "bg-blue-800/40"}`}
            >
              <div
                className="flex items-center justify-between gap-x-4"
                onClick={() => Menu.key && toggleSubMenu(Menu.key)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{Menu.icon}</span>
                  <span
                    className={`${!open && "hidden"} origin-left ease-in-out duration-300`}
                  >
                    {Menu.title}
                  </span>
                </div>

                {Menu.subMenu && (
                  <span
                    className={`ml-auto cursor-pointer text-sm transition-transform ease-in-out duration-300 ${!open ? "hidden" : ""
                      }`}
                  >
                    {subMenus[Menu.key ?? ""] ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                )}
              </div>

              {Menu.subMenu && subMenus[Menu.key ?? ""] && (
                <ul className="pl-3 pt-4 text-zinc-300">
                  {Menu.subMenu.map((subMenu, subIndex) => (
                    <li
                      key={subIndex}
                      className="text-sm flex items-center gap-x-2 py-3 px-2 hover:bg-blue-800 rounded-lg"
                    >
                      <FaChevronRight className="text-xs" />
                      {subMenu}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar para móviles */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 bg-zinc-900 p-5">
            <button
              className="absolute top-5 right-5 text-white text-xl"
              onClick={() => setMobileOpen(false)}
            >
              &times;
            </button>
            {/* Menus móviles */}
            <ul className="pt-6 space-y-0.5">
              {Menus.map((Menu, index) => (
                <li
                  key={index}
                  className={`flex flex-col rounded-md py-3 px-4 cursor-pointer hover:text-white text-zinc-50 hover:bg-blue-800/50 transition-all ease-in-out duration-300 ${Menu.gap ? "mt-9" : "mt-2"
                    } ${index === 0 && "bg-blue-800/40"}`}
                >
                  <div
                    className="flex items-center justify-between gap-x-4"
                    onClick={() => Menu.key && toggleSubMenu(Menu.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{Menu.icon}</span>
                      <span>{Menu.title}</span>
                    </div>
                    {Menu.subMenu && (
                      <span className="ml-auto cursor-pointer text-sm transition-transform ease-in-out duration-300">
                        {subMenus[Menu.key ?? ""] ? <FaChevronDown /> : <FaChevronRight />}
                      </span>
                    )}
                  </div>
                  {Menu.subMenu && subMenus[Menu.key ?? ""] && (
                    <ul className="pl-3 pt-4 text-zinc-300">
                      {Menu.subMenu.map((subMenu, subIndex) => (
                        <li
                          key={subIndex}
                          className="text-sm flex items-center gap-x-2 py-3 px-2 hover:bg-blue-800 rounded-lg"
                        >
                          <FaChevronRight className="text-xs" />
                          {subMenu}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col bg-zinc-100">
        {/* Navbar */}
        <div className="w-full h-[8ch] px-4 md:px-12 bg-zinc-50 shadow-md flex items-center justify-between">
          {/* Botón hamburguesa para móvil */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMobileOpen(true)}
          >
            &#9776;
          </button>

          {/* Buscador */}
          <div className="flex-1 max-w-full md:max-w-[24rem] border border-zinc-300 rounded-full h-11 flex items-center justify-center ml-2">
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
          <div className="flex items-center gap-x-4 md:gap-x-8 ml-2 relative">

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
                <FaBell className="text-xl" />
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
                      <a href="/Registro">Cerrar sesión</a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Children Content */}
        <div className="w-full flex-1 overflow-auto px-4 md:px-12 py-4">{children}</div>
      </div>
    </div>
  );
}
