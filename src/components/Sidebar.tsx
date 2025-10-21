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
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [subMenus, setSubMenus] = useState<{ [key: string]: boolean }>({});

  const Menus = role === "Administrador" ? ADMIN_MENUS : USER_MENUS;

  const toggleSubMenu = (key: string) => {
    setSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderSubMenu = (items: any[]) => (
    <ul className="pl-3 pt-2 text-zinc-300">
      {items.map((item: any, index: number) => (
        <li key={index} className="text-sm py-1 px-2">
          {item.subMenu ? (
            <>
              <div
                className="flex justify-between items-center cursor-pointer hover:bg-blue-800 rounded-lg px-2 py-1"
                onClick={() => toggleSubMenu(item.key ?? "")}
              >
                <span>{item.title}</span>
                {subMenus[item.key ?? ""] ? <FaChevronDown /> : <FaChevronRight />}
              </div>
              {subMenus[item.key ?? ""] && renderSubMenu(item.subMenu)}
            </>
          ) : (
            <Link href={item.path} className="block hover:bg-blue-800 rounded-lg px-2 py-1">
              {item.title}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <div className={`hidden md:flex flex-col ${open ? "w-72 p-5" : "w-20 p-4"} bg-zinc-900 h-full pt-8 relative duration-300 ease-in-out`}>
        {/* Toggle button */}
        <div
          className={`absolute cursor-pointer -right-4 top-9 w-8 h-8 p-0.5 bg-zinc-50 border-zinc-50 border-2 rounded-full text-xl flex items-center justify-center ${!open && "rotate-180"} transition-all ease-in-out duration-300`}
          onClick={() => setOpen(!open)}
        >
          {open ? <TbLayoutSidebarLeftExpand className="text-zinc-900" /> : <TbLayoutSidebarLeftCollapse className="text-zinc-900" />}
        </div>

        {/* Logo */}
        <div className="flex gap-x-4 items-center">
          <img
            src="/dashboard/logoitsva.webp"
            alt="logo"
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full object-cover object-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 ${open && "rotate-[360deg]"}`}
          />
          <h1 className={`text-zinc-50 origin-left font-semibold text-xl duration-200 ease-in-out ${!open && "scale-0"}`}>
            SISTEMA DE BOLSA
          </h1>
        </div>

        {/* Menus Desktop */}
        <ul className="pt-6 space-y-0.5">
          {Menus.map((Menu, index) => (
            <li key={index} className="flex flex-col rounded-md py-3 px-4 cursor-pointer hover:bg-blue-800/50 text-zinc-50">
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
                      Menu.key && toggleSubMenu(Menu.key);
                    } else {
                      Menu.key && toggleSubMenu(Menu.key);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{Menu.icon}</span>
                    <span className={`${!open && "hidden"}`}>{Menu.title}</span>
                  </div>
                  {Menu.subMenu && open && (
                    <span>{subMenus[Menu.key ?? ""] ? <FaChevronDown /> : <FaChevronRight />}</span>
                  )}
                </div>
              )}

              {open && Menu.subMenu && subMenus[Menu.key ?? ""] && renderSubMenu(Menu.subMenu)}
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-zinc-900 p-5">
            <button className="absolute top-5 right-5 text-white text-xl" onClick={() => setMobileOpen(false)}>
              &times;
            </button>
            <ul className="pt-6 space-y-0.5">
              {Menus.map((Menu, index) => (
                <li key={index} className="flex flex-col rounded-md py-3 px-4 cursor-pointer hover:bg-blue-800/50 text-zinc-50">
                  {Menu.path && !Menu.subMenu ? (
                    <Link href={Menu.path} className="flex items-center gap-x-4" onClick={() => setMobileOpen(false)}>
                      <span className="text-lg">{Menu.icon}</span>
                      <span>{Menu.title}</span>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between gap-x-4" onClick={() => Menu.key && toggleSubMenu(Menu.key)}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{Menu.icon}</span>
                        <span>{Menu.title}</span>
                      </div>
                      {Menu.subMenu && (
                        <span>{subMenus[Menu.key ?? ""] ? <FaChevronDown /> : <FaChevronRight />}</span>
                      )}
                    </div>
                  )}

                  {Menu.subMenu && subMenus[Menu.key ?? ""] && renderSubMenu(Menu.subMenu)}
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
