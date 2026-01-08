"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import Image from "next/image";
import type { UsuarioGestion } from "@/types/GestionUsuario";
import toast from "react-hot-toast";

interface Rol {
  id_roles: number;
  nombre: string;
}

interface ModalUsuarioProps {
  usuario: UsuarioGestion;
  onClose: () => void;
  onActualizado?: () => void;
}

export default function ModalUsuario({
  usuario,
  onClose,
  onActualizado,
}: ModalUsuarioProps) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState(usuario);
  const [rolesDisponibles, setRolesDisponibles] = useState<Rol[]>([]);

  const { data: session } = useSession();
  const usuarioActual = session?.user;

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const res = await axios.get("/api/Admin/Roles"); // ← endpoint nuevo que haremos luego
        setRolesDisponibles(res.data.roles);
      } catch (error) {
        console.error("Error al cargar roles:", error);
      }
    };
    cargarRoles();
  }, []);

  // Manejo de inputs base
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar cambios (solo lo editable)
  const handleGuardar = async () => {
    try {
      setGuardando(true);

      const body = {
        roles_id: formData.roles_id,
        egresado: formData.egresados_perfil
          ? {
            verificado_en: formData.egresados_perfil.verificado_en,
            verificado_por_usuarios_id:
              formData.egresados_perfil.verificado_por_usuarios_id,
          }
          : null,
        empresas: formData.empresas_perfil
          ? {
            verificado_en: formData.empresas_perfil.verificado_en,
            verificado_por_usuarios_id:
              formData.empresas_perfil.verificado_por_usuarios_id,
          }
          : null,
      };

      const res = await axios.put(
        `/api/Admin/GestionUsuario/${usuario.id_usuarios}`,
        body
      );

      if (res.data.success) {
        toast("Usuario actualizado correctamente");
        setModoEdicion(false);
        onActualizado?.();
      } else {
        toast(res.data.error || "No se pudo actualizar el usuario");
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      toast("Error al actualizar el usuario");
    } finally {
      setGuardando(false);
    }
  };


  const fotoPerfil =
    usuario?.foto_perfil && usuario.foto_perfil.startsWith("http")
      ? usuario.foto_perfil // Imagen externa
      : usuario?.foto_perfil
        ? usuario.foto_perfil // Imagen servida desde /api/Usuarios/...
        : "https://cdn.pixabay.com/photo/2016/11/21/11/17/model-1844729_640.jpg";

  // 🔧 Función auxiliar para renderizar perfil según tipo
  const renderPerfil = () => {
    if (usuario.egresados_perfil) {
      const perfil = formData.egresados_perfil;
      return (
        <div className="border-t pt-4 mt-4 max-h-[80vh] overflow-y-auto px-1">
          {/* Encabezado */}
          <h3 className="font-semibold text-xl text-[#011848] mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-5 bg-[#53b431] rounded-full"></span>
            Perfil de Egresado
          </h3>

          {/* Sección superior */}
          <div className="flex items-center gap-4 mb-5 bg-[#f1f1f1] p-3 rounded-xl shadow-sm">
            <Image
              src={fotoPerfil}
              alt="Foto de perfil"
              width={70}
              height={70}
              className="rounded-full object-cover border-4 border-[#53b431]/60 shadow-sm"
            />
            <div>
              <p className="text-base font-semibold text-[#011848]">
                {usuario?.nombre} {usuario?.apellido}
              </p>
              <p className="text-sm text-gray-500">{usuario?.correo}</p>
              <p className="text-sm text-gray-500">
                <strong>Celular:</strong>{" "}
                {usuario?.celular ?? "Registrado Por Google"}
              </p>
            </div>
          </div>

          {/* Datos Generales */}
          <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
            <p>
              <strong>Matrícula:</strong> {perfil?.matricula ?? "—"}
            </p>
            <p>
              <strong>Título:</strong> {perfil?.titulo ?? "—"}
            </p>
            <p>
              <strong>Puesto:</strong> {perfil?.puesto ?? "—"}
            </p>
            <p>
              <strong>Fecha de egreso:</strong>{" "}
              {perfil?.fecha_egreso
                ? dayjs(perfil.fecha_egreso).format("DD/MM/YYYY")
                : "—"}
            </p>
            <p>
              <strong>Correo institucional:</strong>{" "}
              {perfil?.correo_institucional ?? "—"}
            </p>
            <p>
              <strong>Ingeniería:</strong>{" "}
              {perfil?.academias_ingenierias?.ingenieria ?? "—"}
            </p>
            <p>
              <strong>Empresa vinculada:</strong>{" "}
              {perfil?.empresas?.nombre_comercial ?? "—"}
            </p>
          </div>

          {/* Línea divisoria */}
          <div className="my-3 border-t border-gray-300"></div>

          {/* Verificación */}
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <label className="block text-sm font-medium text-[#011848] mb-2">
              Verificación
            </label>

            {modoEdicion ? (
              <select
                value={
                  formData.egresados_perfil?.verificado_por_usuarios_id
                    ? "si"
                    : ""
                }
                onChange={(e) => {
                  const deseaVerificar = e.target.value === "si";
                  setFormData((prev) => ({
                    ...prev,
                    egresados_perfil: prev.egresados_perfil
                      ? {
                        ...prev.egresados_perfil,
                        verificado_por_usuarios_id: deseaVerificar
                          ? usuarioActual?.id ?? null
                          : null,
                        verificado_por: deseaVerificar
                          ? {
                            nombre: usuarioActual?.nombre ?? "",
                            apellido: "",
                            correo: usuarioActual?.correo ?? "",
                          }
                          : null,
                        verificado_en: deseaVerificar
                          ? dayjs().format("YYYY-MM-DD")
                          : null,
                      }
                      : null,
                  }));
                }}
                className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-[#53b431] focus:outline-none"
              >
                <option value="">Seleccione una opción</option>
                <option value="si">Verificar Usuario</option>
                <option value="no">No Verificar</option>
              </select>
            ) : (
              <input
                type="text"
                value={
                  formData.egresados_perfil?.verificado_por
                    ? `${formData.egresados_perfil.verificado_por.nombre} ${formData.egresados_perfil.verificado_por.apellido}`
                    : "No verificado"
                }
                disabled
                className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed text-sm"
              />
            )}

            <div className="mt-3">
              <label className="block text-sm font-medium text-[#011848] mb-2">
                Fecha de Verificación
              </label>
              <input
                type="text"
                value={
                  perfil?.verificado_en
                    ? dayjs.utc(perfil.verificado_en).format("DD/MM/YYYY")
                    : "—"
                }
                disabled
                className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed text-sm"
              />
            </div>
          </div>
        </div>
      );
    }

    if (usuario.docentes) {
      const perfil = formData.docentes;
      return (
        <div className="border-t pt-4 mt-4 max-h-[80vh] overflow-y-auto px-1">
          {/* Encabezado */}
          <h3 className="font-semibold text-xl text-[#011848] mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-5 bg-[#53b431] rounded-full"></span>
            Perfil de Docente
          </h3>

          {/* Sección superior */}
          <div className="flex items-center gap-4 mb-5 bg-[#f1f1f1] p-3 rounded-xl shadow-sm">
            <Image
              src={fotoPerfil}
              alt="Foto de perfil"
              width={70}
              height={70}
              className="rounded-full object-cover border-4 border-[#53b431]/60 shadow-sm"
            />
            <div>
              <p className="text-base font-semibold text-[#011848]">
                {usuario?.nombre} {usuario?.apellido}
              </p>
              <p className="text-sm text-gray-500">{usuario?.correo}</p>
              <p className="text-sm text-gray-500">
                <strong>Celular:</strong>{" "}
                {usuario?.celular ?? "Registrado Por Google"}
              </p>
            </div>
          </div>

          {/* Datos Generales */}
          <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
            <p>
              <strong>Título:</strong> {perfil?.titulo ?? "—"}
            </p>
            <p>
              <strong>Puesto:</strong> {perfil?.puesto ?? "—"}
            </p>
            <p>
              <strong>Empresa:</strong>{" "}
              {perfil?.empresas?.nombre_comercial ?? "—"}
            </p>
          </div>

          {/* Línea divisoria */}
          <div className="my-3 border-t border-gray-300"></div>

          {/* Verificación */}
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <label className="block text-sm font-medium text-[#011848] mb-2">
              Verificación
            </label>
          </div>
        </div>
      );
    }

    if (usuario.empresas_perfil) {
      const perfil = formData.empresas_perfil;
      return (
        <div className="border-t pt-4 mt-4 max-h-[80vh] overflow-y-auto px-1">
          {/* Encabezado */}
          <h3 className="font-semibold text-xl text-[#011848] mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-5 bg-[#53b431] rounded-full"></span>
            Perfil de Empresa
          </h3>

          {/* Sección superior */}
          <div className="flex items-center gap-4 mb-5 bg-[#f1f1f1] p-3 rounded-xl shadow-sm">
            <Image
              src={fotoPerfil}
              alt="Foto de perfil"
              width={70}
              height={70}
              className="rounded-full object-cover border-4 border-[#53b431]/60 shadow-sm"
            />
            <div>
              <p className="text-base font-semibold text-[#011848]">
                {usuario?.nombre} {usuario?.apellido}
              </p>
              <p className="text-sm text-gray-500">{usuario?.correo}</p>
              <p className="text-sm text-gray-500">
                <strong>Celular:</strong>{" "}
                {usuario?.celular ?? "Registrado Por Google"}
              </p>
            </div>
          </div>

          {/* Datos Generales */}
          <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
            <p>
              <strong>Nombre comercial:</strong>{" "}
              {perfil?.nombre_comercial ?? "—"}
            </p>
            <p>
              <strong>Razón social:</strong> {perfil?.razon_social ?? "—"}
            </p>
            <p>
              <strong>RFC:</strong> {perfil?.rfc ?? "—"}
            </p>
            <p>
              <strong>Dirección:</strong> {perfil?.direccion ?? "—"}
            </p>
            <p>
              <strong>Teléfono:</strong> {perfil?.telefono ?? "—"}
            </p>
            <p>
              <strong>Correo:</strong> {perfil?.correo_empresas ?? "—"}
            </p>
            <p>
              <strong>Puesto:</strong> {perfil?.puesto ?? "—"}
            </p>
          </div>

          {/* Línea divisoria */}
          <div className="my-3 border-t border-gray-300"></div>

          {/* Verificación */}
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <label className="block text-sm font-medium text-[#011848] mb-2">
              Verificación
            </label>

            {modoEdicion ? (
              <select
                value={
                  formData.empresas_perfil?.verificado_por_usuarios_id
                    ? "si"
                    : ""
                }
                onChange={(e) => {
                  const deseaVerificar = e.target.value === "si";
                  setFormData((prev) => ({
                    ...prev,
                    empresas_perfil: prev.empresas_perfil
                      ? {
                        ...prev.empresas_perfil,
                        verificado_por_usuarios_id: deseaVerificar
                          ? usuarioActual?.id ?? null
                          : null,
                        verificado_por: deseaVerificar
                          ? {
                            nombre: usuarioActual?.nombre ?? "",
                            apellido: "",
                            correo: usuarioActual?.correo ?? "",
                          }
                          : null,
                        verificado_en: deseaVerificar
                          ? dayjs().format("YYYY-MM-DD")
                          : null,
                      }
                      : null,
                  }));
                }}
                className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-[#53b431] focus:outline-none"
              >
                <option value="">Seleccione una opción</option>
                <option value="si">Verificar Empresa</option>
                <option value="no">No Verificar</option>
              </select>
            ) : (
              <input
                type="text"
                value={
                  formData.empresas_perfil?.verificado_por
                    ? `${formData.empresas_perfil.verificado_por.nombre} ${formData.empresas_perfil.verificado_por.apellido}`
                    : "No verificado"
                }
                disabled
                className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed text-sm"
              />
            )}

            <div className="mt-3">
              <label className="block text-sm font-medium text-[#011848] mb-2">
                Fecha de Verificación
              </label>
              <input
                type="text"
                value={
                  perfil?.verificado_en
                    ? dayjs.utc(perfil.verificado_en).format("DD/MM/YYYY")
                    : "—"
                }
                disabled
                className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed text-sm"
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-lg relative flex flex-col px-6 py-4">
        {/* Botón cerrar */}
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          {modoEdicion
            ? "Editar usuario"
            : `${usuario.nombre} ${usuario.apellido}`}
        </h2>

        {/* Campos base */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled
              className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido || "----"}
              disabled
              className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Rol
            </label>

            {modoEdicion ? (
              <select
                name="roles_id"
                value={formData.roles_id || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    roles_id: Number(e.target.value),
                  })
                }
                className="w-full border rounded-md p-2"
              >
                <option value="">Seleccione uno</option>
                {rolesDisponibles.map((rol) => (
                  <option key={rol.id_roles} value={rol.id_roles}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData.roles?.nombre ?? "—"}
                disabled
                className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Correo
            </label>
            <input
              type="text"
              value={formData.correo}
              disabled
              className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Sección del perfil dinámico */}
        {renderPerfil()}

        {/* Botones */}
        <div className="flex justify-end mt-6 gap-3">
          {!modoEdicion ? (
            <button
              onClick={() => setModoEdicion(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Editar
            </button>
          ) : (
            <>
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {guardando ? "Guardando..." : "Guardar"}
              </button>
              <button
                onClick={() => {
                  setModoEdicion(false);
                  setFormData(usuario);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
