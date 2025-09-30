"use client";
import Link from "next/link";
import { AppRole } from "@/types/roles";
import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import { USER_MENUS, ADMIN_MENUS } from "@/constans/sidebarItems";

export default function Sidebar({ role }: { role: AppRole }) {
  const [open, setOpen] = useState(true); // desktop
  const [mobileOpen, setMobileOpen] = useState(false); // mobile
  const [subMenus, setSubMenus] = useState<{ [key: string]: boolean }>({});

  // 👉 Menús según rol
  const Menus = role === "Administrador" ? ADMIN_MENUS : USER_MENUS;

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
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <TbLayoutSidebarLeftExpand className="text-zinc-900" />
          ) : (
            <TbLayoutSidebarLeftCollapse className="text-zinc-900" />
          )}
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

        {/* Menus Desktop */}
        <ul className="pt-6 space-y-0.5">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className="flex flex-col rounded-md py-3 px-4 cursor-pointer hover:bg-blue-800/50 text-zinc-50"
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
                  onClick={() => {
                    if (!open) {
                      setOpen(true); // 👉 abre el sidebar si está cerrado
                      Menu.key && toggleSubMenu(Menu.key); // 👉 abre también el submenú al mismo tiempo
                    } else {
                      Menu.key && toggleSubMenu(Menu.key); // 👉 si ya está abierto, solo alterna el submenu
                    }
                  }}
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

              {/* Submenus Desktop */}
              {open && Menu.subMenu && subMenus[Menu.key ?? ""] && (
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
                    className="flex flex-col rounded-md py-3 px-4 cursor-pointer hover:bg-blue-800/50 text-zinc-50"
                  >
                    {Menu.path && !Menu.subMenu ? (
                      <Link
                        href={Menu.path}
                        className="flex items-center gap-x-4"
                        onClick={() => setMobileOpen(false)} // 👉 cerrar en móvil
                      >
                        <span className="text-lg">{Menu.icon}</span>
                        <span>{Menu.title}</span>
                      </Link>
                    ) : (
                      <div
                        className="flex items-center justify-between gap-x-4"
                        onClick={() => Menu.key && toggleSubMenu(Menu.key)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{Menu.icon}</span>
                          <span>{Menu.title}</span>
                        </div>
                        {Menu.subMenu && (
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

                    {/* Submenus Mobile */}
                    {Menu.subMenu && subMenus[Menu.key ?? ""] && (
                      <ul className="pl-3 pt-2 text-zinc-300">
                        {Menu.subMenu.map((sub, subIndex) => (
                          <li
                            key={subIndex}
                            className="text-sm py-2 px-2 hover:bg-blue-800 rounded-lg"
                            onClick={() => setMobileOpen(false)}
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
          </div>
        )}

        {/* Botón abrir sidebar en móvil */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed bottom-5 left-5 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
        >
          ☰
        </button>
      </>
      );
}
