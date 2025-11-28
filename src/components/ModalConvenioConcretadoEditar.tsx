"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface MetaConvenio {
  id_metas_convenios: number;
  nombre: string;
}

interface ConvenioConcretado {
  id_convenio_concretado: number;
  id_solicitud: number;
  documento_ruta: string | null;
  fecha_firmada: string | null;
  vigencia: string | null;
  unidad_vigencia: string | null;
  fecha_expira: string | null;
  eficiencia: number;
  meta: {
    id_metas_convenios: number;
    nombre: string;
  };
}

export default function ModalEditarConvenioConcretado({
  abierto,
  onCerrar,
  convenio,
  metasConvenios,
  onActualizar,
  cargando,
}: {
  abierto: boolean;
  onCerrar: () => void;
  convenio: ConvenioConcretado | null;
  metasConvenios: MetaConvenio[];
  onActualizar: (formData: FormData) => void;
  cargando: boolean;
}) {
  const [fechaFirmada, setFechaFirmada] = useState("");
  const [vigencia, setVigencia] = useState("");
  const [unidadVigencia, setUnidadVigencia] = useState("años");
  const [fechaExpira, setFechaExpira] = useState("");
  const [idMetaConvenio, setIdMetaConvenio] = useState("");
  const [eficiencia, setEficiencia] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);

  useEffect(() => {
    if (convenio) {
      setFechaFirmada(dayjs.utc(convenio.fecha_firmada).format("YYYY-MM-DD"));
      setVigencia(convenio.vigencia ?? "");
      setUnidadVigencia(convenio.unidad_vigencia ?? "años");
      setFechaExpira(dayjs.utc(convenio.fecha_expira).format("DD/MM/YYYY"));
      setIdMetaConvenio(String(convenio.meta?.id_metas_convenios ?? ""));
      setEficiencia(String(convenio.eficiencia ?? ""));
    }
  }, [convenio]);

  useEffect(() => {
    if (fechaFirmada && vigencia && unidadVigencia) {
      const cantidad = parseInt(vigencia);
      if (!isNaN(cantidad)) {
        const fechaBase = dayjs.utc(fechaFirmada, "YYYY-MM-DD");
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
        const nuevaFecha = fechaBase.add(cantidad, unidad);
        setFechaExpira(nuevaFecha.format("YYYY-MM-DD"));
      }
    }
  }, [fechaFirmada, vigencia, unidadVigencia]);

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convenio) return;

    const formData = new FormData();
    formData.append(
      "id_convenio_concretado",
      String(convenio.id_convenio_concretado)
    );
    formData.append("fecha_firmada", fechaFirmada);
    formData.append("vigencia", vigencia);
    formData.append("unidad_vigencia", unidadVigencia);
    formData.append("fecha_expira", fechaExpira);
    formData.append("id_metas_convenios", idMetaConvenio);
    formData.append("eficiencia", eficiencia);
    if (archivo) formData.append("documento", archivo);

    onActualizar(formData);
  };

  return (
    <AnimatePresence>
      {abierto && convenio && (
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
              Editar Convenio Concretado
            </h2>

            {/* 🔹 Metas del Convenio */}
            <div className="mb-3">
              <label className="block text-sm font-medium">
                Metas del Convenio
              </label>
              <select
                value={idMetaConvenio}
                onChange={(e) => setIdMetaConvenio(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
                required
              >
                <option value="">Seleccione una meta</option>
                {metasConvenios.map((meta) => (
                  <option
                    key={meta.id_metas_convenios}
                    value={meta.id_metas_convenios}
                  >
                    {meta.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* 🔹 Eficiencia */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Eficiencia</label>
              <input
                type="number"
                min="0"
                value={eficiencia}
                onChange={(e) => setEficiencia(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
                required
              />
            </div>

            {/* 🔹 Fecha Firmada */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Fecha Firmada</label>
              <input
                type="date"
                value={fechaFirmada}
                onChange={(e) => setFechaFirmada(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
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
                  className="w-1/2 border rounded-lg px-3 py-2 mt-1"
                  required
                />
                <select
                  value={unidadVigencia}
                  onChange={(e) => setUnidadVigencia(e.target.value)}
                  className="w-1/2 border rounded-lg px-3 py-2 mt-1"
                  required
                >
                  <option value="días">Días</option>
                  <option value="meses">Meses</option>
                  <option value="años">Años</option>
                </select>
              </div>
            </div>

            {/* 🔹 Fecha Expira */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Fecha Expira</label>
              <input
                type="date"
                value={fechaExpira}
                readOnly
                className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100"
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
                className="px-4 py-2 rounded-lg text-white bg-[#011848] hover:bg-[#022063] transition disabled:bg-[#9cd57e]"
              >
                {cargando ? "Actualizando..." : "Actualizar Convenio"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
