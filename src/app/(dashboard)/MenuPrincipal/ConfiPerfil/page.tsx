"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UploadFile from "@/components/Subir_documentos";
import Image from "next/image";

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
      alert("Perfil actualizado correctamente");
      setEditMode(false);
      setUser(data.user);
      setFormData(data.user);
    } else {
      alert("Error al actualizar: " + data.error);
    }
  };

  if (status === "loading") return <div>Cargando sesión...</div>;
  if (!user) return <div>Cargando datos del usuario...</div>;

  return (
    <div className="p-6 bg-white rounded shadow text-black max-w-3xl mx-auto">
      {/* CABECERA */}
      <div className="flex items-center gap-4 mb-6">
        {user.imagen_perfil ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300">
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
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border">
            Sin imagen
          </div>
        )}

        <div>
          {editMode ? (
            <>
              <input
                type="text"
                value={formData?.nombre || ""}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, nombre: e.target.value } : prev
                  )
                }
                className="border rounded p-1 mr-2"
              />
              <input
                type="text"
                value={formData?.apellido || ""}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, apellido: e.target.value } : prev
                  )
                }
                className="border rounded p-1"
              />
              <input
                type="text"
                value={formData?.celular || ""}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, celular: e.target.value } : prev
                  )
                }
                className="border rounded p-1 block mt-2"
                placeholder="Celular"
              />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">
                {user.nombre} {user.apellido}
              </h1>
              <p className="text-gray-600">{user.correo}</p>
              {user.celular && <p className="text-gray-600">{user.celular}</p>}
            </>
          )}

          {/* Subir foto de perfil (NO SE EDITA) */}
          <UploadFile
            userId={user.id}
            tipo="foto_usuario"
            onUploaded={(url) =>
              setUser((prev) => (prev ? { ...prev, imagen_perfil: url } : prev))
            }
          />
        </div>
      </div>

      {/* BOTONES */}
      <div className="mb-4 flex gap-2">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Editar perfil
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setFormData(user);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </>
        )}
      </div>

            {/* INFORMACIÓN DE DOCENTE */}
      {user.rol === "Docente" && formData?.docentes && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Información de Docente</h2>
          {formData.docentes.map((doc, i) => (
            <div key={doc.id_docentes} className="mb-4 p-4 border rounded">
              <p>
                <strong>Título:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
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
                    className="border rounded p-1 ml-2"
                  />
                ) : (
                  doc.titulo || "-"
                )}
              </p>
              <p>
                <strong>Puesto:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
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
                    className="border rounded p-1 ml-2"
                  />
                ) : (
                  doc.puesto || "-"
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* INFORMACIÓN DE EMPRESA */}
      {user.rol === "Empresa" && formData?.empresas && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Información de Empresa</h2>
          {formData.empresas.map((emp, i) => (
            <div key={emp.id_empresas} className="mb-4 p-4 border rounded">
              <p>
                <strong>Nombre Comercial:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    value={emp.nombre_comercial}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev
                          ? {
                            ...prev,
                            empresas: prev.empresas?.map((empresa, idx) =>
                              idx === i
                                ? { ...empresa, nombre_comercial: e.target.value }
                                : empresa
                            ),
                          }
                          : prev
                      )
                    }
                    className="border rounded p-1 ml-2"
                  />
                ) : (
                  emp.nombre_comercial
                )}
              </p>
              {emp.razon_social && (
                <p>
                  <strong>Razón Social:</strong>{" "}
                  {editMode ? (
                    <input
                      type="text"
                      value={emp.razon_social}
                      onChange={(e) =>
                        setFormData((prev) =>
                          prev
                            ? {
                              ...prev,
                              empresas: prev.empresas?.map((empresa, idx) =>
                                idx === i
                                  ? { ...empresa, razon_social: e.target.value }
                                  : empresa
                              ),
                            }
                            : prev
                        )
                      }
                      className="border rounded p-1 ml-2"
                    />
                  ) : (
                    emp.razon_social
                  )}
                </p>
              )}
              <p>
                <strong>RFC:</strong> {emp.rfc}
              </p>
              {emp.direccion && (
                <p>
                  <strong>Dirección:</strong>{" "}
                  {editMode ? (
                    <input
                      type="text"
                      value={emp.direccion}
                      onChange={(e) =>
                        setFormData((prev) =>
                          prev
                            ? {
                              ...prev,
                              empresas: prev.empresas?.map((empresa, idx) =>
                                idx === i
                                  ? { ...empresa, direccion: e.target.value }
                                  : empresa
                              ),
                            }
                            : prev
                        )
                      }
                      className="border rounded p-1 ml-2 w-full"
                    />
                  ) : (
                    emp.direccion
                  )}
                </p>
              )}
              {emp.correo_empresas && (
                <p>
                  <strong>Correo Empresa:</strong>{" "}
                  {editMode ? (
                    <input
                      type="text"
                      value={emp.correo_empresas}
                      onChange={(e) =>
                        setFormData((prev) =>
                          prev
                            ? {
                              ...prev,
                              empresas: prev.empresas?.map((empresa, idx) =>
                                idx === i
                                  ? { ...empresa, correo_empresas: e.target.value }
                                  : empresa
                              ),
                            }
                            : prev
                        )
                      }
                      className="border rounded p-1 ml-2 w-full"
                    />
                  ) : (
                    emp.correo_empresas 
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* INFORMACIÓN DE EGRESADO */}
      {user.rol === "Egresado" && formData?.egresados && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Información de Egresado</h2>
          {formData.egresados.map((eg, i) => (
            <div key={eg.id_egresados} className="mb-4 p-4 border rounded">
              <p>
                <strong>Título:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    value={eg.titulo || ""}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev
                          ? {
                            ...prev,
                            egresados: prev.egresados?.map((egresado, idx) =>
                              idx === i ? { ...egresado, titulo: e.target.value } : egresado
                            ),
                          }
                          : prev
                      )
                    }
                    className="border rounded p-1 ml-2"
                  />
                ) : (
                  eg.titulo || "-"
                )}
              </p>
              <p>
                <strong>Puesto:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    value={eg.puesto || ""}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev
                          ? {
                            ...prev,
                            egresados: prev.egresados?.map((egresado, idx) =>
                              idx === i ? { ...egresado, puesto: e.target.value } : egresado
                            ),
                          }
                          : prev
                      )
                    }
                    className="border rounded p-1 ml-2"
                  />
                ) : (
                  eg.puesto || "-"
                )}
              </p>
              <p>
                <strong>Matrícula:</strong> {eg.matricula}
              </p>
              <p>
                <strong>Fecha de egreso:</strong> {eg.fecha_egreso}
              </p>
              <p>
                <strong>Correo Institucional:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    value={eg.correo_institucional || ""}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev
                          ? {
                            ...prev,
                            egresados: prev.egresados?.map((egresado, idx) =>
                              idx === i ? { ...egresado, correo_institucional: e.target.value } : egresado
                            ),
                          }
                          : prev
                      )
                    }
                    className="border rounded p-1 ml-2"
                  />
                ) : (
                  eg.correo_institucional || "-"
                )}
              </p>
              <p>
                <strong>CV:</strong>{" "}
                {eg.cv_url ? (
                  <a
                    href={eg.cv_url}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Ver PDF
                  </a>
                ) : (
                  "-"
                )}
              </p>

              {/* Subir CV (NO SE EDITA) */}
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
          ))}
        </div>
      )}
    </div>
  );
}
