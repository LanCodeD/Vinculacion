"use client";
import { motion, AnimatePresence } from "framer-motion";

interface ModalConfirmacionProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  confirmando?: boolean;
  tipo?: "confirmar" | "eliminar"; // 👈 nuevo prop opcional
}

export default function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  onConfirmar,
  onCancelar,
  confirmando = false,
  tipo = "confirmar",
}: ModalConfirmacionProps) {
  const esEliminar = tipo === "eliminar";

  return (
    <AnimatePresence>
      {abierto && (
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
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-black"
          >
            <h2
              className={`text-xl font-semibold mb-2 ${
                esEliminar ? "text-red-600" : "text-[#011848]"
              }`}
            >
              {titulo}
            </h2>
            <p className="text-gray-700 mb-6">{mensaje}</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={onCancelar}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancelar
              </button>

              <button
                onClick={onConfirmar}
                disabled={confirmando}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  confirmando
                    ? esEliminar
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-green-400 cursor-not-allowed"
                    : esEliminar
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {confirmando
                  ? esEliminar
                    ? "Eliminando..."
                    : "Finalizando..."
                  : esEliminar
                  ? "Eliminar"
                  : "Finalizar"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
