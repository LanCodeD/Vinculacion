"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FaFilePdf } from "react-icons/fa";

interface Contacto {
  id_contactos: number;
  nombre: string | null;
  apellido: string | null;
  correo: string | null;
  puesto: string | null;
  titulo: string | null;
  empresas_id: number;
  grupos_id: number | null;
  es_representante: number;
  creado_en: string;
  contacto_estados: {
    nombre_estado: string;
  };
  empresas: {
    nombre_comercial: string;
  };
}

export default function ContactoEstadosPage() {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [descargando, setDescargando] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      const data = await fetchContactos();
      setContactos(data);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const fetchContactos = async (): Promise<Contacto[]> => {
    try {
      const res = await axios.get("/api/Admin/Contacto");
      return res.data;
    } catch (err) {
      console.error("Error al cargar contactos:", err);
      throw new Error("No se pudo cargar la información");
    }
  };

  return (
    <main className="p-6 text-black">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Contactos Registrados
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex justify-end mb-4">
 <button
    onClick={async () => {
      try {
        setDescargando(true); // 🔵 Bloquea el botón

        const res = await axios.post(
          "/api/Admin/Convenios/Concretados/reportes/Contactos",
          { contactos },
          { responseType: "blob" }
        );

        const url = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ReporteContactos-${new Date().toISOString().slice(0, 10)}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error al generar PDF:", error);
      } finally {
        setDescargando(false); // 🔴 Libera el botón
      }
    }}
    disabled={descargando}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition shadow-lg ${
      descargando ? "bg-gray-500 cursor-not-allowed" : "bg-[#011848] hover:bg-[#022063]"
    }`}
  >
    {!descargando ? (
      <>
        <FaFilePdf className="text-xl" />
        Exportar a PDF
      </>
    ) : (
      <span className="animate-pulse">Descargando...</span>
    )}
  </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm text-left bg-white">
          <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
            <tr>
              <th className="px-4 py-3 border-b text-left">ID</th>
              <th className="px-4 py-3 border-b text-left">Nombre</th>
              <th className="px-4 py-3 border-b text-left">Apellido</th>
              <th className="px-4 py-3 border-b text-left">Correo</th>
              <th className="px-4 py-3 border-b text-left">Puesto</th>
              <th className="px-4 py-3 border-b text-left">Empresa</th>
              <th className="px-4 py-3 border-b text-left">Grupo ID</th>
              <th className="px-4 py-3 border-b text-left">Representante</th>
              <th className="px-4 py-3 border-b text-left">Estado</th>
              <th className="px-4 py-3 border-b text-left">Creado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {contactos.map((c) => (
              <tr key={c.id_contactos} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{c.id_contactos}</td>
                <td className="px-4 py-2">{c.nombre ?? "—"}</td>
                <td className="px-4 py-2">{c.apellido ?? "—"}</td>
                <td className="px-4 py-2">{c.correo ?? "—"}</td>
                <td className="px-4 py-2">{c.puesto ?? "—"}</td>
                <td className="px-4 py-2">
                  {c.empresas?.nombre_comercial ?? "—"}
                </td>
                <td className="px-4 py-2">{c.grupos_id ?? "—"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      c.es_representante === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {c.es_representante === 1 ? "Sí" : "No"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      c.contacto_estados?.nombre_estado === "Activo"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.contacto_estados?.nombre_estado ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(c.creado_en).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
