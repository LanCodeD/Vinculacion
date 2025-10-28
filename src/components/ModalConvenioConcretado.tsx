"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc); // 👈 Evita problemas de zona horaria

interface SolicitudFinalizada {
  id_solicitud: number;
  estado: {
    id_estado: number;
    nombre_estado: string;
  };
}

export default function ModalCrearConvenioConcretado({
  abierto,
  onCerrar,
  onCrear,
  cargando,
  solicitudesFinalizadas,
}: {
  abierto: boolean;
  onCerrar: () => void;
  onCrear: (formData: FormData) => void;
  cargando: boolean;
  solicitudesFinalizadas: SolicitudFinalizada[];
}) {
  const [idSolicitud, setIdSolicitud] = useState("");
  const [fechaFirmada, setFechaFirmada] = useState("");
  const [vigencia, setVigencia] = useState("");

  const [unidadVigencia, setUnidadVigencia] = useState("años"); // 👈 nueva unidad
  const [fechaExpira, setFechaExpira] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);

  // 🧠 Calcular fecha_expira automáticamente cuando cambie algo
  useEffect(() => {
    if (fechaFirmada && vigencia && unidadVigencia) {
      const cantidad = parseInt(vigencia);
      if (!isNaN(cantidad)) {
        // ✅ Interpretar la fecha como UTC para evitar desfase
        const fechaBase = dayjs.utc(fechaFirmada, "YYYY-MM-DD");

        // ✅ Traducir las unidades al formato que entiende dayjs
        let unidad: dayjs.ManipulateType;
        switch (unidadVigencia.toLowerCase()) {
          case "días":
            unidad = "day";
            break;
          case "meses":
            unidad = "month";
            break;
          case "años":
            unidad = "year";
            break;
          default:
            unidad = "day";
        }

        // ✅ Calcular la nueva fecha
        const nuevaFecha = fechaBase.add(cantidad, unidad);

        // ✅ Formatearla para input[type="date"]
        setFechaExpira(nuevaFecha.format("YYYY-MM-DD"));
      } else {
        setFechaExpira("");
      }
    } else {
      setFechaExpira("");
    }
  }, [fechaFirmada, vigencia, unidadVigencia]);

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id_solicitud", idSolicitud);
    formData.append("fecha_firmada", fechaFirmada);
    formData.append("vigencia", vigencia);
    formData.append("unidad_vigencia", unidadVigencia);
    formData.append("fecha_expira", fechaExpira);
    if (archivo) formData.append("documento", archivo);
    onCrear(formData);
  };

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={manejarSubmit}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg p-6 text-black"
          >
            <h2 className="text-xl font-semibold text-[#011848] mb-4">
              Crear Convenio Concretado
            </h2>

            {/* 🔹 Solicitud Finalizada */}
            <select
              value={idSolicitud}
              onChange={(e) => setIdSolicitud(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
              required
            >
              <option value="">Seleccione una solicitud finalizada</option>
              {solicitudesFinalizadas.map((solicitud) => (
                <option
                  key={solicitud.id_solicitud}
                  value={solicitud.id_solicitud}
                >
                  {`Solicitud #${solicitud.id_solicitud} - ${solicitud.estado.nombre_estado}`}
                </option>
              ))}
            </select>

            {/* 🔹 Fecha Firmada */}
            <div className="mb-3 mt-3">
              <label className="block text-sm font-medium">Fecha Firmada</label>
              <input
                type="date"
                value={fechaFirmada}
                onChange={(e) => setFechaFirmada(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
                required
              />
            </div>

            {/* 🔹 Vigencia y Unidad */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Vigencia</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={vigencia}
                  onChange={(e) => setVigencia(e.target.value)}
                  className="w-1/2 border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
                  required
                />
                <select
                  value={unidadVigencia}
                  onChange={(e) => setUnidadVigencia(e.target.value)}
                  className="w-1/2 border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-[#011848]"
                  required
                >
                  <option value="">Unidad</option>
                  <option value="días">Días</option>
                  <option value="meses">Meses</option>
                  <option value="años">Años</option>
                </select>
              </div>
            </div>

            {/* 🔹 Fecha Expira (automática) */}
            <div className="mb-3">
              <label className="block text-sm font-medium">
                Fecha de Expiración
              </label>
              <input
                type="date"
                value={fechaExpira}
                readOnly
                className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 focus:ring-2 focus:ring-[#011848]"
              />
            </div>

            {/* 🔹 Documento PDF */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Documento PDF
              </label>
              <div className="flex items-center gap-3">
                <label className="bg-[#011848] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#022063] transition">
                  Subir archivo
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      setArchivo(e.target.files ? e.target.files[0] : null)
                    }
                    className="hidden"
                  />
                </label>
                {archivo && (
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">
                    {archivo.name}
                  </span>
                )}
              </div>
            </div>

            {/* 🔹 Botones */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={onCerrar}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={cargando}
                className="px-4 py-2 rounded-lg text-white bg-[#53b431] hover:bg-[#469a29] transition disabled:bg-[#9cd57e]"
              >
                {cargando ? "Creando..." : "Crear Convenio"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
