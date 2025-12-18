// src/app/%28dashboard%29/MenuPrincipal/ConfiPerfil/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UploadFile from "@/components/Subir_documentos";
import Image from "next/image";
import toast from "react-hot-toast";
import { FileText } from "lucide-react";

interface UserProfile {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  celular?: string;
  rol: string;
  tipoCuenta: string;
  last_login?: string;
  paso_actual: number;
  empresas?: {
    id_empresas: number;
    nombre_comercial: string;
    razon_social?: string;
    rfc: string;
    direccion?: string;
    correo_empresas?: string;
    telefono?: string;
  }[];
  egresados?: {
    id_egresados: number;
    titulo?: string;
    puesto?: string;
    matricula: string;
    fecha_egreso?: string;
    correo_institucional?: string;
    cv_url?: string;
    foto_perfil?: string;
  }[];
  docentes?: {
    id_docentes: number;
    titulo?: string;
    puesto?: string;
  }[];
  imagen_perfil?: string;
}

export default function Perfil() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    const userId = session?.user?.id;
    if (!userId) return;

    fetch(`/api/Users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.rol === "Egresado" && data.egresados?.[0]?.foto_perfil) {
          const parts = data.egresados[0].foto_perfil.split("/");
          const nombreArchivo = parts[parts.length - 1];
          data.imagen_perfil = `/api/Usuarios/archivos/Perfiles/${encodeURIComponent(
            nombreArchivo
          )}`;
        } else if (data.rol === "Empresa" && data.empresas?.[0]?.foto_perfil) {
          const parts = data.empresas[0].foto_perfil.split("/");
          const nombreArchivo = parts[parts.length - 1];
          data.imagen_perfil = `/api/Usuarios/archivos/Perfiles/${encodeURIComponent(
            nombreArchivo
          )}`;
        }
        setUser(data);
        setFormData(data);
      })
      .catch((err) => console.error("Error al obtener usuario:", err));
  }, [status, session]);

  const handleSave = async () => {
    if (!formData) return;

    const res = await fetch(`/api/Users/${formData.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.ok) {
      toast("Perfil actualizado correctamente");
      setEditMode(false);
      setUser(data.user);
      setFormData(data.user);
    } else {
      toast("Error al actualizar: " + data.error);
    }
  };

  if (status === "loading") return <div>Cargando sesión...</div>;
  if (!user) return <div>Cargando datos del usuario...</div>;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-black">

      {/* ===================== CABECERA ===================== */}
      <div className="flex flex-col items-center gap-6 mb-10 w-full">
        {user.imagen_perfil ? (
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm">
            <Image
              src={user.imagen_perfil}
              alt="Foto de perfil"
              fill
              className="object-cover object-center"
              unoptimized
              priority
            />
          </div>
        ) : (
          <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border">
            Sin imagen
          </div>
        )}

        <div className="text-center space-y-1">
          {editMode ? (
            <div className="space-y-2">
              <div className="flex gap-2 justify-center">
                <input
                  type="text"
                  value={formData?.nombre || ""}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev ? { ...prev, nombre: e.target.value } : prev
                    )
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Nombre"
                />
                <input
                  type="text"
                  value={formData?.apellido || ""}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev ? { ...prev, apellido: e.target.value } : prev
                    )
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Apellido"
                />
              </div>
              <input
                type="text"
                value={formData?.celular || ""}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, celular: e.target.value } : prev
                  )
                }
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                placeholder="Celular"
              />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold">
                {user.nombre} {user.apellido}
              </h1>
              <p className="text-gray-600 text-sm">{user.correo}</p>
              {user.celular && (
                <p className="text-gray-600 text-sm">{user.celular}</p>
              )}
            </>
          )}

          <UploadFile
            userId={user.id}
            tipo="foto_usuario"
            onUploaded={(url) =>
              setUser((prev) => (prev ? { ...prev, imagen_perfil: url } : prev))
            }
          />
        </div>
      </div>

      {/* ===================== BOTONES ===================== */}
      <div className="mb-10 flex gap-3 justify-center">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
          >
            Editar perfil
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white"
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setFormData(user);
              }}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-gray-400 hover:bg-gray-500 text-white"
            >
              Cancelar
            </button>
          </>
        )}
      </div>

      {/* ===================== DOCENTE ===================== */}
      {user.rol === "Docente" && formData?.docentes && (
        <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            Información de Docente
          </h2>

          {formData.docentes.map((doc, i) => (
            <div
              key={doc.id_docentes}
              className="bg-white border border-gray-200 rounded-lg p-5 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm mb-6"
            >
              <div>
                <span className="block text-gray-500 text-sm font-medium mb-1">
                  Título
                </span>
                {editMode ? (
                  <input
                    value={doc.titulo || ""}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev
                          ? {
                            ...prev,
                            docentes: prev.docentes?.map((d, idx) =>
                              idx === i ? { ...d, titulo: e.target.value } : d
                            ),
                          }
                          : prev
                      )
                    }
                    className="border rounded-md px-3 py-2 text-sm w-full"
                  />
                ) : (
                  <p className="text-sm">{doc.titulo || "-"}</p>
                )}
              </div>

              <div>
                <span className="block text-gray-500 text-sm font-medium mb-1">
                  Puesto
                </span>
                {editMode ? (
                  <input
                    value={doc.puesto || ""}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev
                          ? {
                            ...prev,
                            docentes: prev.docentes?.map((d, idx) =>
                              idx === i ? { ...d, puesto: e.target.value } : d
                            ),
                          }
                          : prev
                      )
                    }
                    className="border rounded-md px-3 py-2 text-sm w-full"
                  />
                ) : (
                  <p className="text-sm">{doc.puesto || "-"}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== EMPRESA ===================== */}
      {user.rol === "Empresa" && formData?.empresas && (
        <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            Información de Empresa
          </h2>

          {formData.empresas.map((emp, i) => (
            <div
              key={emp.id_empresas}
              className="bg-white border border-gray-200 rounded-lg p-5 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm mb-6"
            >
              <div>
                <span className="block text-gray-500 text-sm font-medium mb-1">
                  Nombre comercial
                </span>
                {editMode ? (
                  <input
                    value={emp.nombre_comercial}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev
                          ? {
                            ...prev,
                            empresas: prev.empresas?.map((empresa, idx) =>
                              idx === i
                                ? {
                                  ...empresa,
                                  nombre_comercial: e.target.value,
                                }
                                : empresa
                            ),
                          }
                          : prev
                      )
                    }
                    className="border rounded-md px-3 py-2 text-sm w-full"
                  />
                ) : (
                  <p className="text-sm">{emp.nombre_comercial}</p>
                )}
              </div>

              <div>
                <span className="block text-gray-500 text-sm font-medium mb-1">
                  RFC
                </span>
                <p className="text-sm">{emp.rfc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== EGRESADO ===================== */}
      {user.rol === "Egresado" && formData?.egresados && (
        <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            Información de Egresado
          </h2>

          {formData.egresados.map((eg, i) => (
            <div
              key={eg.id_egresados}
              className="bg-white border border-gray-200 rounded-lg p-5 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm mb-6"
            >
              <div>
                <span className="block text-gray-500 text-sm font-medium mb-1">
                  Título
                </span>
                {editMode ? (
                  <input
                    value={eg.titulo || ""}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev
                          ? {
                            ...prev,
                            egresados: prev.egresados?.map((egresado, idx) =>
                              idx === i
                                ? { ...egresado, titulo: e.target.value }
                                : egresado
                            ),
                          }
                          : prev
                      )
                    }
                    className="border rounded-md px-3 py-2 text-sm w-full"
                  />
                ) : (
                  <p className="text-sm">{eg.titulo || "-"}</p>
                )}
              </div>

              <div>
                <span className="block text-gray-500 text-sm font-medium mb-1">
                  Matrícula
                </span>
                <p className="text-sm">{eg.matricula}</p>
              </div>
              <div>
                <span className="block text-gray-500 text-sm font-medium mb-1">
                  Correo institucional
                </span>
                <p className="text-sm">{eg.correo_institucional}</p>
              </div>

              <div>
                <span className="block text-gray-500 text-sm font-medium mb-1">
                  Fecha de egreso
                </span>
                <p className="text-sm">
                  {eg.fecha_egreso
                    ? new Date(eg.fecha_egreso).toLocaleDateString("es-MX")
                    : "-"}
                </p>
              </div>
              <div className="md:col-span-2 pt-4 border-t">
                <span className="block text-gray-500 text-sm font-medium mb-2">
                  Currículum Vitae
                </span>

                {eg.cv_url ? (
                  <a
                    href={eg.cv_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <FileText size={18} />
                    <span className="text-sm font-medium">CV</span>
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">No cargado</p>
                )}

                <div className="mt-3">
                  <UploadFile
                    userId={user.id}
                    tipo="cv"
                    idEgresado={eg.id_egresados}
                    onUploaded={(url) =>
                      setUser((prev) =>
                        prev
                          ? {
                            ...prev,
                            egresados: prev.egresados?.map((e) =>
                              e.id_egresados === eg.id_egresados
                                ? { ...e, cv_url: url }
                                : e
                            ),
                          }
                          : prev
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
