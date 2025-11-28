"use client";

import { useState } from "react";
import { FaArrowRight, FaBell } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Notificacion {
    id_notificaciones: number;
    titulo: string;
    mensaje: string;
    metadata?: { vacanteId?: number; postulacionId?: number };
    leido?: boolean;
}

interface NotificationDropdownProps {
    notifications: Notificacion[];
    hasUnread: boolean;
    setHasUnread: (value: boolean) => void;
}

export default function NotificationDropdown({
    notifications,
    hasUnread,
    setHasUnread,
}: NotificationDropdownProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const handleOpenDropdown = async () => {
        const nextState = !showDropdown;
        setShowDropdown(nextState);

        if (nextState && hasUnread) {
            // Marcar todas las notificaciones como leídas en backend
            await fetch("/api/Notificaciones/leer", { method: "PATCH" });
            setHasUnread(false);
        }
    };

    const handleClickNotificacion = async (n: Notificacion) => {
        // Marcar notificación específica como leída
        await fetch(`/api/Notificaciones/leer/${n.id_notificaciones}`, { method: "PATCH" });

        setHasUnread(false);
        setShowDropdown(false);

        // Construir URL dinámicamente según metadata
        const url = n.metadata?.vacanteId
            ? `/Admin/BolsaTrabajoAD/${n.metadata.vacanteId}`
            : n.metadata?.postulacionId
                ? `/BolsaTrabajo/Postulaciones/${n.metadata.postulacionId}`
                : "/Notificaciones"; // fallback si no tiene metadata

        router.push(url); // redirige en la misma pestaña
    };

    const handleVerMas = async () => {
        await fetch("/api/Notificaciones/leer", { method: "PATCH" });
        setHasUnread(false);
        setShowDropdown(false);
        router.push("/Notificaciones"); // abre en la misma pestaña
    };

    return (
        <div className="relative">
            {/* Botón de campana */}
            <button onClick={handleOpenDropdown} className="relative focus:outline-none">
                {hasUnread && (
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600"></span>
                    </span>
                )}
                <FaBell className="text-xl text-black" />
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-md ring-1 ring-black/10 overflow-hidden z-50">
                    <div className="px-4 py-2 border-b border-gray-200 font-semibold text-gray-700">
                        Notificaciones
                    </div>

                    <ul>
                        {notifications.slice(0, 5).map((n) => (
                            <li
                                key={n.id_notificaciones}
                                className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                                onClick={() => handleClickNotificacion(n)}
                            >
                                <p className="font-normal text-gray-800">{n.titulo}</p>
                                <p className="text-xs text-gray-600">{n.mensaje}</p>
                            </li>
                        ))}

                        {/* Ver más */}
                        <li
                            className="px-4 py-2 text-center text-gray-400 hover:text-blue-600 cursor-pointer transition-colors duration-150 flex items-center justify-center gap-1"
                            onClick={handleVerMas}
                        >
                            <FaArrowRight className="w-4 h-4" />
                            <span className="text-sm">Ver más</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
