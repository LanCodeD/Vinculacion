"use client";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface MetaConvenio {
  id_metas_convenios: number;
  nombre: string;
}

type EstadoConvenio = "ACTIVO" | "PRÓXIMO A VENCER" | "VENCIDO" | "SIN FECHA";

interface ConvenioConcretado {
  id_convenio_concretado: number;
  id_solicitud: number;
  documento_ruta: string | null;
  fecha_firmada: string | null;
  vigencia: string | null;
  unidad_vigencia: string | null;
  fecha_expira: string | null;
  created_at: string;
  updated_at: string;
  estado_dinamico: EstadoConvenio;
  color_estado: string;
  eficiencia: number;
  meta: {
    id_metas_convenios: number;
    nombre: string;
  };
  solicitud: {
    id_solicitud: number;
    tipo?: { nombre_tipo: string };
    creador?: { nombre: string; correo: string };
    estado?: { nombre_estado: string };
    solicitud_firmas_origen?: { firma?: { nombre: string } }[];
    detalle: {
      alcance: string;
      dependencia_nombre: string;
      dependencia_responsable_nombre: string;
      descripcion_empresa: string;
      fecha_conclusion_proyecto: string;
      fecha_inicio_proyecto: string;
      dependencia_domicilio_legal: string;
    };
  };
}

export default function ModalVerConvenioConcretado({
  abierto,
  onCerrar,
  convenio,
}: {
  abierto: boolean;
  onCerrar: () => void;
  convenio: ConvenioConcretado | null;
}) {
  return (
    <AnimatePresence>
      {abierto && convenio && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl p-8 text-black overflow-y-auto max-h-[90vh]"
          >
            {/* 🔹 Header */}
            <h2 className="text-2xl font-bold text-[#011848] mb-6 border-b pb-2">
              Detalles del Convenio Concretado
            </h2>

            {/* 🔹 Grid de información */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-500 font-semibold">ID Convenio Concretado</p>
                <p className="text-gray-800">
                  {convenio.id_convenio_concretado}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-semibold">Solicitud</p>
                <p className="text-gray-800">
                  #{convenio.solicitud?.id_solicitud}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-semibold">Tipo de Solicitud</p>
                <p className="text-gray-800">
                  {convenio.solicitud?.tipo?.nombre_tipo ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-semibold">Solicitante</p>
                <p className="text-gray-800">
                  {convenio.solicitud?.creador?.nombre} (
                  {convenio.solicitud?.creador?.correo})
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-gray-500 font-semibold">Firmas de Origen</p>
                <p className="text-gray-800">
                  {convenio.solicitud?.solicitud_firmas_origen
                    ?.map((f) => f.firma?.nombre)
                    .join(", ") ?? "Sin firmas"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-semibold">Meta del Convenio</p>
                <p className="text-gray-800">{convenio.meta?.nombre}</p>
              </div>

              <div>
                <p className="text-gray-500 font-semibold">Eficiencia</p>
                <p className="text-gray-800">{convenio.eficiencia}</p>
              </div>

              <div>
                <p className="text-gray-500 font-semibold">Fecha Firmada</p>
                <p className="text-gray-800">
                  {convenio.fecha_firmada
                    ? dayjs.utc(convenio.fecha_firmada).format("DD/MM/YYYY")
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-semibold">Vigencia</p>
                <p className="text-gray-800">
                  {convenio.vigencia} {convenio.unidad_vigencia}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-semibold">Fecha Expira</p>
                <p className="text-gray-800">
                  {convenio.fecha_expira
                    ? dayjs.utc(convenio.fecha_expira).format("DD/MM/YYYY")
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-semibold">Estado Dinámico</p>
                <p className={`font-semibold ${convenio.color_estado}`}>
                  {convenio.estado_dinamico}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-semibold">Estado Solicitud</p>
                <p className="text-gray-800">
                  {convenio.solicitud?.estado?.nombre_estado ?? "—"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-gray-500 font-semibold">Documento</p>
                {convenio.documento_ruta ? (
                  <a
                    href={convenio.documento_ruta}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Ver documento
                  </a>
                ) : (
                  <p className="text-gray-800">No disponible</p>
                )}
              </div>

              {/* 🔹 Campos de detalle opcionales */}
              {convenio.solicitud?.detalle?.alcance && (
                <div className="md:col-span-2">
                  <p className="text-gray-500 font-semibold">Alcance</p>
                  <p className="text-gray-800">
                    {convenio.solicitud.detalle.alcance}
                  </p>
                </div>
              )}

              {convenio.solicitud?.detalle?.fecha_inicio_proyecto && (
                <div>
                  <p className="text-gray-500 font-semibold">
                    Fecha inicio proyecto
                  </p>
                  <p className="text-gray-800">
                    {dayjs
                      .utc(convenio.solicitud.detalle.fecha_inicio_proyecto)
                      .format("DD/MM/YYYY")}
                  </p>
                </div>
              )}

              {convenio.solicitud?.detalle?.fecha_conclusion_proyecto && (
                <div>
                  <p className="text-gray-500 font-semibold">
                    Fecha conclusión proyecto
                  </p>
                  <p className="text-gray-800">
                    {dayjs
                      .utc(convenio.solicitud.detalle.fecha_conclusion_proyecto)
                      .format("DD/MM/YYYY")}
                  </p>
                </div>
              )}

              {convenio.solicitud?.detalle?.dependencia_nombre && (
                <div>
                  <p className="text-gray-500 font-semibold">Dependencia</p>
                  <p className="text-gray-800">
                    {convenio.solicitud.detalle.dependencia_nombre}
                  </p>
                </div>
              )}

              {convenio.solicitud?.detalle?.dependencia_responsable_nombre && (
                <div>
                  <p className="text-gray-500 font-semibold">Dependencia Responsable</p>
                  <p className="text-gray-800">
                    {convenio.solicitud.detalle.dependencia_responsable_nombre}
                  </p>
                </div>
              )}

              {convenio.solicitud?.detalle?.descripcion_empresa && (
                <div className="md:col-span-2">
                  <p className="text-gray-500 font-semibold">
                    Descripción empresa
                  </p>
                  <p className="text-gray-800">
                    {convenio.solicitud.detalle.descripcion_empresa}
                  </p>
                </div>
              )}

              {convenio.solicitud?.detalle?.dependencia_domicilio_legal && (
                <div className="md:col-span-2">
                  <p className="text-gray-500 font-semibold">Domicilio legal</p>
                  <p className="text-gray-800">
                    {convenio.solicitud.detalle.dependencia_domicilio_legal}
                  </p>
                </div>
              )}

              <div>
                <p className="text-gray-500 font-semibold">Creado</p>
                <p className="text-gray-800">
                  {dayjs.utc(convenio.created_at).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-semibold">
                  Última actualización
                </p>
                <p className="text-gray-800">
                  {dayjs.utc(convenio.updated_at).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
            </div>

            {/* 🔹 Footer */}
            <div className="flex justify-end gap-3 mt-8 border-t pt-4">
              <button
                type="button"
                onClick={onCerrar}
                className="px-5 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
