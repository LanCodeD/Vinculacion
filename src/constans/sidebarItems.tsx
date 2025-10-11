// constants/sidebarItems.ts
import { MdSpaceDashboard, MdOutlineHeadsetMic } from "react-icons/md";
import { BiChat } from "react-icons/bi";
import { TiCalendar } from "react-icons/ti";
import { FiTable } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import { FaGears } from "react-icons/fa6";
import { sub } from "framer-motion/client";

export const USER_MENUS = [
  { title: "Menu Principal", icon: <MdSpaceDashboard />, path: "/MenuPrincipal" },
  {
    title: "Servicios",
    icon: <BiChat />,
    key: "servicios",
    subMenu: [
      { title: "Convenios", path: "/Convenios" },
      {
        title: "Bolsa de trabajo",
        key : "bolsa",
        subMenu: [
          { title: "Información", path: "/" },
          { title: "Vacantes", path: "/BolsaTrabajo" },
          { title: "Mis Postulaciones", path: "/" },
        ],
      },
    ],
  },
  { title: "Calendar", icon: <TiCalendar />, path: "/Admin/PanelAdmin" },
  { title: "Tables", icon: <FiTable />, path: "/tables" },
  { title: "Analytics", icon: <GoGraph />, path: "/analytics" },
  { title: "Soporte", icon: <MdOutlineHeadsetMic />, path: "/support" },
  {
    title: "Configuración",
    icon: <FaGears />,
    subMenu: [
      { title: "Perfil", path: "/MenuPrincipal/ConfiPerfil" },
      { title: "Tema", path: "/MenuPrincipal/ConfiTema" },
      { title: "Gestion", path: "/MenuPrincipal/ConfiGestion" },
    ],
    key: "settings",
  },
];



export const ADMIN_MENUS = [
  { title: "Admin", icon: <MdSpaceDashboard />, path: "/Admin/ConfiguracionAdmin" },
  {
    title: "Gestión",
    icon: <FaGears />,
    subMenu: [
      { title: "Usuarios", path: "/Admin/GestionUsuarios" },
      { title: "Convenios", path: "/Admin/GestionConvenios" },
      { title: "Bolsa de Trabajo", path: "/Admin/BolsaTrabajoAD" },
    ],
    key: "gestion",
  },
    {
    title: "Configuración",
    icon: <FaGears />,
    subMenu: [
      { title: "Perfil", path: "/Registro" },
      { title: "Tema", path: "/MenuPrincipal/ConfiTema" },
      { title: "Gestion", path: "/MenuPrincipal/ConfiGestion" },
    ],
    key: "settings",
  },
  { title: "Soporte", icon: <MdOutlineHeadsetMic />, path: "/Admin/PanelAdmin" },
];
