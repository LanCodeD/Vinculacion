'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AvisoPrivacidadProps {
  onAccept: () => void;
}

export default function AvisoPrivacidad({ onAccept }: AvisoPrivacidadProps) {
  const [visible, setVisible] = useState(true);

  const handleAccept = () => {
    setVisible(false);
    onAccept();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-md w-[90%] text-center border border-gray-200"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Aviso de Privacidad
            </h2>
            <p className="text-gray-700 mb-5 leading-relaxed">
              Tus datos serán utilizados con fines educativos. Al continuar,
              aceptas que podamos registrar esta información.
            </p>
            <button
              onClick={handleAccept}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
            >
              Aceptar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
