"use client";

import Link from "next/link";
import { AppRole } from "@/types/roles";
import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import {
  USER_MENUS,
  ADMIN_MENUS,
  PERSONAL_PLANTEL_MENUS,
} from "@/constans/sidebarItems";
import Image from "next/image";

interface SidebarItem {
  title: string;
  path?: string;
  key?: string;
  icon?: React.ReactNode;
  subMenu?: SidebarItem[];
}

export default function Sidebar({ role }: { role: AppRole }) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [subMenus, setSubMenus] = useState<{ [key: string]: boolean }>({});

  // Menús según el rol del usuario
  let Menus: SidebarItem[] = USER_MENUS;
  if (role === "Administrador") {
    Menus = ADMIN_MENUS;
  } else if (role === "Personal-Plantel") {
    Menus = PERSONAL_PLANTEL_MENUS;
  }

  // Alterna submenús por su "key"
  const toggleSubMenu = (key: string) => {
    setSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Renderiza submenús de forma recursiva
  const renderSubMenu = (items: SidebarItem[]) => (
    <ul className="pl-3 pt-2 text-zinc-300 border-l border-zinc-700/40">
      {items.map((item: SidebarItem, index: number) => (
        <li
          key={index}
          className="text-sm py-1 px-2 rounded-lg hover:bg-blue-800/40"
        >
          {item.subMenu ? (
            <>
              <div
                className="flex justify-between items-center cursor-pointer px-2 py-1"
                onClick={() => toggleSubMenu(item.key ?? "")}
              >
                <span>{item.title}</span>
                {subMenus[item.key ?? ""] ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </div>
              {subMenus[item.key ?? ""] && renderSubMenu(item.subMenu)}
            </>
          ) : item.path ? (
            <Link
              href={item.path}
              className="block px-2 py-1 hover:bg-blue-700/50 rounded-md"
            >
              {item.title}
            </Link>
          ) : (
            <span className="block px-2 py-1 text-zinc-400 cursor-not-allowed">
              {item.title}
            </span>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <div
        className={`hidden md:flex flex-col ${
          open ? "w-72 p-5" : "w-20 p-4"
        } bg-zinc-900 h-full pt-8 relative duration-300 ease-in-out`}
      >
        {/* Botón de expandir/colapsar */}
        <div
          className={`absolute cursor-pointer -right-4 top-9 w-8 h-8 p-0.5 bg-zinc-50 border-zinc-50 border-2 rounded-full text-xl flex items-center justify-center transition-all ease-in-out duration-300 ${
            !open && "rotate-180"
          }`}
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
          <Image
            src="/Dashboard/logoitsva.webp"
            alt="Logo ITSVA"
            width={48}
            height={48}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full object-cover object-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 ${
              open && "rotate-360"
            }`}
            priority
          />

          <h1
            className={`text-zinc-50 origin-left font-semibold text-xl duration-200 ease-in-out ${
              !open && "scale-0"
            }`}
          >
            SISTEMA DE BOLSA
          </h1>
        </div>

        {/* Menús Desktop */}
        <ul className="pt-6 space-y-0.5">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className="flex flex-col rounded-md py-3 px-4 cursor-pointer hover:bg-blue-800/50 text-zinc-50"
            >
              {Menu.path && !Menu.subMenu ? (
                <Link href={Menu.path} className="flex items-center gap-x-4">
                  <span className="text-lg">{Menu.icon}</span>
                  <span className={`${!open && "hidden"}`}>{Menu.title}</span>
                </Link>
              ) : (
                <div
                  className="flex items-center justify-between gap-x-4"
                  onClick={() => {
                    if (!open) {
                      setOpen(true);
                      if (Menu.key) {
                        toggleSubMenu(Menu.key);
                      }
                    } else {
                      if (Menu.key) {
                        toggleSubMenu(Menu.key);
                      }
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

              {open &&
                Menu.subMenu &&
                subMenus[Menu.key ?? ""] &&
                renderSubMenu(Menu.subMenu)}
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
          <div className="relative w-72 bg-zinc-900 p-5 overflow-y-auto">
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
                      onClick={() => setMobileOpen(false)}
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

                  {Menu.subMenu &&
                    subMenus[Menu.key ?? ""] &&
                    renderSubMenu(Menu.subMenu)}
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
