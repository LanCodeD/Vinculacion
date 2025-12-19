"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FaFilePdf } from "react-icons/fa";
import ModalCrearContacto from "@/components/Componentes_administrador/ModalCrearContacto";
import ModalEditarContacto from "@/components/Componentes_administrador/ModalEditarContacto";
import { FaEdit } from "react-icons/fa";

export interface Contacto {
  id_contactos: number;
  nombre: string | null;
  apellido: string | null;
  correo: string | null;
  puesto: string | null;
  celular: string | null;
  titulo: string | null;
  empresas_id: number;
  es_representante: number;
  creado_en: string;
  contacto_estados: {
    id_contacto_estados: number;
    nombre_estado: string;
  };
  empresas: {
    id_empresas: number;
    nombre_comercial: string;
  };
  grupos: {
    id_grupos: number;
    nombre_grupo: string; // 🔹 nombre del grupo
  };
}

export default function ContactoEstadosPage() {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [descargando, setDescargando] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  const [empresas, setEmpresas] = useState<
    { id_empresas: number; nombre_comercial: string }[]
  >([]);
  const [grupos, setGrupos] = useState<
    { id_grupos: number; nombre_grupo: string }[]
  >([]);
  const [activos, setActivos] = useState<
    { id_contacto_estados: number; nombre_estado: string }[]
  >([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [contactoSeleccionado, setContactoSeleccionado] =
    useState<Contacto | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const contactosPorPagina = 6;

  // Filtrar por búsqueda
  const contactosFiltrados = contactos.filter((c) =>
    `${c.nombre} ${c.apellido} ${c.correo} ${c.empresas.nombre_comercial} ${c.titulo}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // Paginación
  const indiceUltimo = paginaActual * contactosPorPagina;
  const indicePrimero = indiceUltimo - contactosPorPagina;
  const contactosPaginados = contactosFiltrados.slice(
    indicePrimero,
    indiceUltimo
  );

  const totalPaginas = Math.ceil(
    contactosFiltrados.length / contactosPorPagina
  );

  const cargarDatos = useCallback(async () => {
    try {
      const data = await fetchContactos();
      setContactos(data);

      const dataEmpresas = await fetchEmpresas();
      setEmpresas(dataEmpresas);

      const dataGrupos = await fetchGrupos();
      setGrupos(dataGrupos);

      const dataActivos = await fetchActivo();
      setActivos(dataActivos);
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
  // 🔹 Recuperar todas las empresas
  const fetchEmpresas = async (): Promise<
    { id_empresas: number; nombre_comercial: string }[]
  > => {
    try {
      const res = await axios.get("/api/Admin/Contacto/Empresas");
      return res.data;
    } catch (err) {
      console.error("Error al cargar empresas:", err);
      throw new Error("No se pudo cargar la información de empresas");
    }
  };

  // 🔹 Recuperar todas las empresas
  const fetchActivo = async (): Promise<
    { id_contacto_estados: number; nombre_estado: string }[]
  > => {
    try {
      const res = await axios.get("/api/Admin/Contacto/Activo");
      return res.data;
    } catch (err) {
      console.error("Error al cargar empresas:", err);
      throw new Error("No se pudo cargar la información de empresas");
    }
  };

  // 🔹 Recuperar todos los grupos
  const fetchGrupos = async (): Promise<
    { id_grupos: number; nombre_grupo: string }[]
  > => {
    try {
      const res = await axios.get("/api/Admin/Contacto/Grupos");
      return res.data;
    } catch (err) {
      console.error("Error al cargar grupos:", err);
      throw new Error("No se pudo cargar la información de grupos");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg text-black space-y-6 w-full">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          Contactos Registrados
        </h1>
        <button
          onClick={() => setModalCrear(true)}
          className="bg-[#011848] hover:bg-[#022063] text-white px-4 py-2 rounded-lg shadow"
        >
          + Crear Contacto
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Toolbar: búsqueda + exportar */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar contacto..."
          className="border rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-[#011848]"
        />

        <button
          onClick={async () => {
            try {
              setDescargando(true);
              const res = await axios.post(
                "/api/Admin/Convenios/Concretados/reportes/Contactos",
                { contactos },
                { responseType: "blob" }
              );
              const url = URL.createObjectURL(res.data);
              const link = document.createElement("a");
              link.href = url;
              link.download = `ReporteContactos-${new Date()
                .toISOString()
                .slice(0, 10)}.pdf`;
              link.click();
              URL.revokeObjectURL(url);
            } catch (error) {
              console.error("Error al generar PDF:", error);
            } finally {
              setDescargando(false);
            }
          }}
          disabled={descargando}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition shadow-lg ${
            descargando
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#011848] hover:bg-[#022063]"
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

      {/* Tabla */}
      <div className="w-full overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-[1200px] text-sm text-left bg-white">
          <thead className="bg-[#011848] text-white text-sm font-semibold">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Apellido</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Celular</th>
              <th className="px-4 py-3">Grado Académico</th>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Puesto</th>
              <th className="px-4 py-3">Grupo</th>
              <th className="px-4 py-3 text-center">Representante</th>
              <th className="px-4 py-3">Estado</th>

              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {contactosPaginados.map((c, idx) => (
              <tr
                key={c.id_contactos}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition`}
              >
                <td className="px-4 py-2">{c.nombre ?? "—"}</td>
                <td className="px-4 py-2">{c.apellido ?? "—"}</td>
                <td className="px-4 py-2">{c.correo ?? "—"}</td>
                <td className="px-4 py-2">{c.celular ?? "—"}</td>
                <td className="px-4 py-2">{c.titulo ?? "—"}</td>
                <td className="px-4 py-2">
                  {c.empresas?.nombre_comercial ?? "—"}
                </td>
                <td className="px-4 py-2">{c.puesto ?? "—"}</td>
                <td className="px-4 py-2">
                  {c.grupos?.nombre_grupo ?? "Sin Grupo"}
                </td>
                <td className="px-4 py-2 text-center">
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
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => {
                      setContactoSeleccionado(c);
                      setModalEditar(true);
                    }}
                    className="p-2 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition"
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={paginaActual === 1}
          onClick={() => setPaginaActual(paginaActual - 1)}
          className="px-3 py-1 rounded-full border disabled:opacity-50"
        >
          ←
        </button>
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => setPaginaActual(i + 1)}
            className={`px-3 py-1 rounded-full border ${
              paginaActual === i + 1 ? "bg-[#011848] text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={paginaActual === totalPaginas}
          onClick={() => setPaginaActual(paginaActual + 1)}
          className="px-3 py-1 rounded-full border disabled:opacity-50"
        >
          →
        </button>
      </div>
      <ModalCrearContacto
        abierto={modalCrear}
        onClose={() => setModalCrear(false)}
        onCreated={cargarDatos}
        empresas={empresas}
        grupos={grupos}
      />
      <ModalEditarContacto
        abierto={modalEditar}
        onClose={() => setModalEditar(false)}
        onUpdated={cargarDatos}
        contacto={contactoSeleccionado}
        empresas={empresas}
        grupos={grupos}
        activos={activos}
      />
    </div>
  );
}
