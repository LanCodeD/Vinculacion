// src/app/(dashboard)/BolsaTrabajo/Postulaciones/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface Postulacion {
    id_postulaciones: number;
    mensaje: string;
    estado: {
        id_postulacion_estados: number;
        nombre_estado: string;
    };
    usuario: {
        id_usuarios: number;
        nombre: string;
        correo: string;
    };
}

export default function PostulacionesPage() {
    const { id } = useParams(); // id de la vacante
    const { data: session } = useSession();
    const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Dentro del useEffect, id =", id);
        if (!id) return;
        fetch(`/api/Ofertas/${id}/Postulaciones`)
            .then(res => res.json())
            .then(data => {
                if (data.ok) setPostulaciones(data.postulaciones);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleCambioEstado = async (postulacionId: number, accion: "aprobar" | "rechazar") => {
        if (!session?.user) return alert("Debes iniciar sesión");
        try {
            const res = await fetch(`/api/Postulaciones/${postulacionId}/estado`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accion, revisadoPorUsuarioId: session.user.id }),
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || "Error al actualizar estado");
            // Actualizar UI
            setPostulaciones(prev =>
                prev.map(p => (p.id_postulaciones === postulacionId ? data.postulacion : p))
            );
            alert("✅ Estado actualizado correctamente");
        } catch (err: any) {
            alert(`❌ ${err.message}`);
        }
    };

    if (loading) return <p className="p-6">Cargando postulaciones...</p>;
    if (postulaciones.length === 0) return <p className="p-6">No hay postulaciones aún.</p>;

    return (
        <section className="p-6">
            <h1 className="text-2xl font-bold mb-4">Postulaciones</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">Nombre</th>
                            <th className="px-4 py-2 border">Correo</th>
                            <th className="px-4 py-2 border">Mensaje</th>
                            <th className="px-4 py-2 border">Estado</th>
                            <th className="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postulaciones.map(p => (
                            <tr key={p.id_postulaciones}>
                                <td className="px-4 py-2 border">{p.usuario.nombre}</td>
                                <td className="px-4 py-2 border">{p.usuario.correo}</td>
                                <td className="px-4 py-2 border">{p.mensaje}</td>
                                <td className="px-4 py-2 border">{p.estado.nombre_estado}</td>
                                <td className="px-4 py-2 border flex gap-2">
                                    <button
                                        onClick={() => handleCambioEstado(p.id_postulaciones, "aprobar")}
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        Aprobar
                                    </button>
                                    <button
                                        onClick={() => handleCambioEstado(p.id_postulaciones, "rechazar")}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Rechazar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
