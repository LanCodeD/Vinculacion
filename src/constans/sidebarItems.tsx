// constants/sidebarItems.ts
import { MdSpaceDashboard, MdOutlineHeadsetMic } from "react-icons/md";
import { BiChat } from "react-icons/bi";
import { TiCalendar } from "react-icons/ti";
import { FiTable } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import { FaGears } from "react-icons/fa6";

export const USER_MENUS = [
  { title: "Menu Principal", icon: <MdSpaceDashboard />, path: "/MenuPrincipal" },
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
        { title: "Convenio Específico", path: "/Convenios/Especificos" }
      ]
    },
    { title: "Bolsa de trabajo", path: "/BolsaTrabajo" }
  ]
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
      key: "gestion",
      subMenu: [
        { title: "Usuarios", path: "/Admin/GestionUsuarios" },
        {
          title: "Solicitudes Convenios",
          key: "admin-convenios",
          subMenu: [
            { title: "Convenio General", path: "/Admin/Convenios/Generales" },
            { title: "Convenio Específico", path: "/Admin/Convenios/Especificos" },
            { title: "Convenio Firmado", path: "/Admin/Convenios/Concretados" },
          ],
        },
      ],
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
