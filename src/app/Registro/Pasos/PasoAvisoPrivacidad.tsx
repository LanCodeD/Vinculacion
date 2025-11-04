// src/app/Registro/Pasos/PasoAvisoPrivacidad.tsx
'use client';

import { motion } from "framer-motion";
import { useState } from "react";

interface PasoAvisoPrivacidadProps {
    onNext: () => void;
    onBack?: () => void;
}

export default function PasoAvisoPrivacidad({ onNext, onBack }: PasoAvisoPrivacidadProps) {
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        try {
            setLoading(true);

            // 📦 Datos del usuario y consentimiento
            const userId = Number(localStorage.getItem("registroUsuarioId"));
            const avisoVersion = "1.0";
            const consentItems = {
                privacidad: true,
                fecha: new Date().toISOString(),
            };

            const res = await fetch("/api/Consents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, avisoVersion, consentItems }),
            });

            if (!res.ok) throw new Error("Error al guardar el consentimiento");

            console.log("Consentimiento guardado correctamente");
            onNext();
        } catch (err) {
            console.error(err);
            alert("Hubo un error al registrar tu consentimiento.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
        >
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
                Aviso de Privacidad
            </h2>
            <p className="text-gray-700 mb-5 leading-relaxed text-justify">
                En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares,
                el Instituto Tecnológico de Valladolid informa que los datos personales proporcionados serán tratados
                de manera confidencial y utilizados exclusivamente para fines académicos, administrativos y de vinculación.
                Al continuar, usted otorga su consentimiento para el uso y resguardo de su información conforme a los
                términos establecidos en el Aviso de Privacidad Institucional.
            </p>
            <div className="flex justify-center gap-4">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="px-5 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 transition"
                        disabled={loading}
                    >
                        Atrás
                    </button>
                )}
                <button
                    onClick={handleAccept}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Guardando..." : "Aceptar y continuar"}
                </button>
            </div>
        </motion.div>
    );
}
