// constants/sidebarItems.ts
import { MdSpaceDashboard, MdOutlineHeadsetMic } from "react-icons/md";
import { BiChat } from "react-icons/bi";
import { TiCalendar } from "react-icons/ti";
import { FiTable } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import { FaGears } from "react-icons/fa6";
import { IoIosContacts } from "react-icons/io";

export const USER_MENUS = [
  {
    title: "Menú Principal",
    icon: <MdSpaceDashboard />,
    path: "/MenuPrincipal",
  },
  {
    title: "Servicios",
    icon: <BiChat />,
    key: "servicios",
    subMenu: [
      {
        title: "Convenios",
        key: "convenios",
        subMenu: [
          { title: "Información General", path: "/Convenios" },
          { title: "Convenio General", path: "/Convenios/Generales" },
          { title: "Convenio Específico", path: "/Convenios/Especificos" },
        ],
      },
      {
        title: "Bolsa de Trabajo",
        key: "bolsa",
        subMenu: [
          { title: "Información", path: "/BolsaTrabajo/InformacionBolsa" },
          { title: "Vacantes", path: "/BolsaTrabajo" },
          {
            title: "Mis Postulaciones",
            path: "/BolsaTrabajo/MisPostulacionesFront",
          },
        ],
      },
    ],
  },
  { title: "Calendario", icon: <TiCalendar />, path: "/Calendar" },
  { title: "Tablas", icon: <FiTable />, path: "/BolsaTrabajo/Postulaciones" },
  { title: "Historial", icon: <GoGraph />, path: "/Historial" },
  { title: "Soporte", icon: <MdOutlineHeadsetMic />, path: "/support" },
  {
    title: "Configuración",
    icon: <FaGears />,
    key: "settings",
    subMenu: [
      { title: "Perfil", path: "/MenuPrincipal/ConfiPerfil" },
      { title: "Tema", path: "/MenuPrincipal/ConfiTema" },
      { title: "Gestión", path: "/MenuPrincipal/ConfiGestion" },
    ],
  },
];

export const ADMIN_MENUS = [
  {
    title: "Dashboard",
    icon: <MdSpaceDashboard />,
    path: "/Admin/ConfiguracionAdmin",
  },
  {
    title: "Gestión",
    icon: <FaGears />,
    key: "gestion",
    subMenu: [
      { title: "Gestión Usuarios", path: "/Admin/GestionUsuario" },
      {
        title: "Convenios",
        key: "admin-convenios",
        subMenu: [
          { title: "Convenio General", path: "/Admin/Convenios/Generales" },
          {
            title: "Convenio Específico",
            path: "/Admin/Convenios/Especificos",
          },
          { title: "Convenio Firmado", path: "/Admin/Convenios/Concretados" },
        ],
      },
      {
        title: "Bolsa de Trabajo",
        key: "admin-bolsa",
        subMenu: [
          { title: "Vacantes", path: "/Admin/BolsaTrabajoAD" },
          {
            title: "Postulaciones",
            path: "/Admin/BolsaTrabajoAD/VacantesInfo",
          },
        ],
      },
    ],
  },
  {
    title: "Reportes",
    icon: <FaGears />,
    key: "reportes",
    subMenu: [
      {
        title: "Reporte de Convenios",
        key: "reporte-convenios",
        subMenu: [
          { title: "Reporte Convenios Concretados", path: "/Admin/Convenios/Reportes" },
          {
            title: "Reporte Solicitudes No Finalizadas",
            path: "/Admin/Convenios/Reportes/Solicitudes",
          },
        ],
      },
      {
        title: "Reporte Bolsa de Trabajo",
        key: "reporte-admin-bolsa",
        subMenu: [
          { title: "Vacantes", path: "/Admin/BolsaTrabajoAD" },
          {
            title: "Postulaciones",
            path: "/Admin/BolsaTrabajoAD/VacantesInfo",
          },
        ],
      },
    ],
  },
  {
    title: "Configuración",
    icon: <FaGears />,
    key: "settings",
    subMenu: [
      { title: "Perfil", path: "/Registro" },
      { title: "Tema", path: "/MenuPrincipal/ConfiTema" },
      { title: "Gestión", path: "/Admin/VerificarUsuarios" },
    ],
  },
  {
    title: "Contactos",
    icon: <IoIosContacts />,
    path: "/Admin/Contactos",
  },
];
