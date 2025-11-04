// src/app/%28dashboard%29/MenuPrincipal/ConfiPerfil/page.tsx
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
    correo?: string;
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
  imagen_perfil?: string;
}

export default function Perfil() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    const userId = session?.user?.id;
    if (!userId) return;

    fetch(`/api/Users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        // Ajustar imagen de perfil usando API de usuarios
        if (data.rol === "Egresado" && data.egresados?.[0]?.foto_perfil) {
          // Extraemos solo el nombre del archivo
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
      })
      .catch((err) => console.error("Error al obtener usuario:", err));
  }, [status, session]);

  if (status === "loading") return <div>Cargando sesión...</div>;
  if (!user) return <div>Cargando datos del usuario...</div>;

  return (
    <div className="p-6 bg-white rounded shadow text-black max-w-3xl mx-auto">
      {/* Cabecera con foto de perfil */}
      <div className="flex items-center gap-4 mb-6">
        {user.imagen_perfil ? (
          <Image
            src={user.imagen_perfil}
            alt="Foto de perfil"
            width={96}
            height={96}
            className="rounded-full object-cover border"
            unoptimized // 🚫 Evita error 400: la imagen proviene de /api/ y no puede ser optimizada por Next.js
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border">
            Sin imagen
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">
            {user.nombre} {user.apellido}
          </h1>
          <p className="text-gray-600">{user.correo}</p>
          {user.celular && <p className="text-gray-600">{user.celular}</p>}
          {/* Subir foto de perfil */}
          <UploadFile
            userId={user.id}
            tipo="foto_usuario" // <-- ahora es global
            onUploaded={(url) =>
              setUser((prev) => (prev ? { ...prev, imagen_perfil: url } : prev))
            }
          />
        </div>
      </div>

      {/* Información de Empresa */}
      {user.rol === "Empresa" && user.empresas && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Información de Empresa</h2>
          {user.empresas.map((emp) => (
            <div key={emp.id_empresas} className="mb-4 p-4 border rounded">
              <p>
                <strong>Nombre Comercial:</strong> {emp.nombre_comercial}
              </p>
              {emp.razon_social && (
                <p>
                  <strong>Razón Social:</strong> {emp.razon_social}
                </p>
              )}
              <p>
                <strong>RFC:</strong> {emp.rfc}
              </p>
              {emp.direccion && (
                <p>
                  <strong>Dirección:</strong> {emp.direccion}
                </p>
              )}
              {emp.correo && (
                <p>
                  <strong>Correo:</strong> {emp.correo}
                </p>
              )}
              {emp.telefono && (
                <p>
                  <strong>Teléfono:</strong> {emp.telefono}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Información de Egresado */}
      {user.rol === "Egresado" && user.egresados && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Información de Egresado
          </h2>
          {user.egresados.map((eg) => (
            <div key={eg.id_egresados} className="mb-4 p-4 border rounded">
              {eg.titulo && (
                <p>
                  <strong>Título:</strong> {eg.titulo}
                </p>
              )}
              {eg.puesto && (
                <p>
                  <strong>Puesto:</strong> {eg.puesto}
                </p>
              )}
              <p>
                <strong>Matrícula:</strong> {eg.matricula}
              </p>
              {eg.fecha_egreso && (
                <p>
                  <strong>Fecha de Egreso:</strong>{" "}
                  {new Date(eg.fecha_egreso).toLocaleDateString()}
                </p>
              )}
              {eg.correo_institucional && (
                <p>
                  <strong>Correo Institucional:</strong>{" "}
                  {eg.correo_institucional}
                </p>
              )}
              {/* {eg.cv_url && <p><strong>CV:</strong> <a href={eg.cv_url} target="_blank" className='text-blue-600 underline'>Ver PDF</a>?? "-" </p>} */}
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
              {/* Subir CV */}
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
