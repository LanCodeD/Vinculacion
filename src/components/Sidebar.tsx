"use client";

import Link from "next/link";
import React, { useState } from "react";
import { BiChat } from "react-icons/bi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
import { FiTable } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import { MdOutlineHeadsetMic, MdSpaceDashboard } from "react-icons/md";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import { TiCalendar } from "react-icons/ti";

export default function Sidebar() {

  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [subMenus, setSubMenus] = useState<{ [key: string]: boolean }>({
    settings: false,
  });

  const Menus = [
    { title: "Menu Principal", icon: <MdSpaceDashboard />, path: "/MenuPrincipal" },
    {
      title: "Servicios",
      icon: <BiChat />,
      gap: true,
      subMenu: [
        { title: "Convenios", path: "/Convenios" },
        { title: "Bolsa de trabajo", path: "/BolsaTrabajo" }
      ],
      key: "servicios",
    },
    { title: "Calendar", icon: <TiCalendar />, path: "/calendar" },
    { title: "Tables", icon: <FiTable />, path: "/tables" },
    { title: "Analytics", icon: <GoGraph />, path: "/analytics" },
    { title: "Soporte", icon: <MdOutlineHeadsetMic />, path: "/support" },
    {
      title: "Configuración",
      icon: <FaGears />,
      subMenu: [
        { title: "Perfil", path: "/ConfiPerfil" },
        { title: "Tema", path: "/settings/notifications" },
        { title: "Gestion", path: "/settings/gestion" },
      ],
      key: "settings",
    },
  ];


  const toggleSubMenu = (menu: string) => {
    setSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <>
      {/* Sidebar Desktop */}
      <div
        className={`hidden md:flex flex-col ${open ? "w-72 p-5" : "w-20 p-4"
          } bg-zinc-900 h-full pt-8 relative duration-300 ease-in-out`}
      >
        {/* Toggle button */}
        <div
          className={`absolute cursor-pointer -right-4 top-9 w-8 h-8 p-0.5 bg-zinc-50 border-zinc-50 border-2 rounded-full text-xl flex items-center justify-center ${!open && "rotate-180"
            } transition-all ease-in-out duration-300`}
          onClick={() => {
            if (open) {
              setSubMenus({});
            }
            setOpen(!open);
          }}
        >
          {open ? <TbLayoutSidebarLeftExpand className="text-black" /> : <TbLayoutSidebarLeftCollapse className="text-black" />}
        </div>

        {/* Logo */}
        <div className="flex gap-x-4 items-center">
          <img
            src="/dashboard/logoitsva.webp"
            alt="logo"
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full object-cover object-center cursor-pointer transition-transform duration-300 ease-in-out 
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

        {/* Menus */}
        <ul className="pt-6 space-y-0.5">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex flex-col rounded-md py-3 px-4 cursor-pointer hover:bg-blue-800/50 text-zinc-50 ${Menu.gap ? "mt-9" : "mt-2"
                } ${index === 0 && "bg-blue-800/40"}`}
            >
              {/* Caso 1: Menú con path directo */}
              {Menu.path && !Menu.subMenu ? (
                <Link href={Menu.path} className="flex items-center gap-x-4">
                  <span className="text-lg">{Menu.icon}</span>
                  <span className={`${!open && "hidden"}`}>{Menu.title}</span>
                </Link>
              ) : (
                /* Caso 2: Menú con submenú desplegable */
                <div
                  className="flex items-center justify-between gap-x-4"
                  onClick={() => Menu.key && toggleSubMenu(Menu.key)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{Menu.icon}</span>
                    <span className={`${!open && "hidden"}`}>{Menu.title}</span>
                  </div>
                  {Menu.subMenu && open && (
                    <span>
                      {subMenus[Menu.key ?? ""] ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </span>
                  )}
                </div>
              )}

              {/* Render de submenús */}
              {Menu.subMenu && subMenus[Menu.key ?? ""] && (
                <ul className="pl-3 pt-2 text-zinc-300">
                  {Menu.subMenu.map((sub, subIndex) => (
                    <li
                      key={subIndex}
                      className="text-sm py-2 px-2 hover:bg-blue-800 rounded-lg"
                    >
                      <Link href={sub.path}>{sub.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Mobile */}
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
                        {subMenus[Menu.key ?? ""] ? (
                          <FaChevronDown />
                        ) : (
                          <FaChevronRight />
                        )}
                      </span>
                    )}
                  </div>
                  {Menu.subMenu && subMenus[Menu.key ?? ""] && (
                    <ul className="pl-3 pt-4 text-zinc-300">
                      {Menu.subMenu.map((subMenu, subIndex) => (
                        <li
                          key={subIndex}
                          className="text-sm flex items-center gap-x-2 py-3 px-2 hover:bg-blue-800 rounded-lg"
                          onClick={() => setMobileOpen(false)} // opcional: cerrar sidebar en móvil
                        >
                          <FaChevronRight className="text-xs" />
                          <Link href={subMenu.path}>{subMenu.title}</Link>
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

      {/* Botón abrir sidebar móvil */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-5 left-5 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
      >
        ☰
      </button>
    </>
  );
}
