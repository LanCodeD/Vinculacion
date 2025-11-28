"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";
import { getFechaLocalSinHora } from "@/lib/fechaLocal";

interface Oferta {
    id: number;
    titulo: string;
    empresa: string;
    empresa_foto?: string | null;
    descripcion_general: string;
    fecha_publicacion: string;
    creado_en: string;
}

interface Postulacion {
    id_postulacion: number;
    nombre: string;
    apellido: string;
    correo: string;
    celular: string;
    foto: string | null;
    cv_url: string | null;
    estado: string;
    estadoId: number;
    mensaje?: string;
}

export default function DetalleOfertaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const ofertaId = Number(id);
    const [oferta, setOferta] = useState<Oferta | null>(null);
    const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/Admin/BolsaTrabajo/Ofertas/${ofertaId}/Postulaciones`)
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setOferta(data.oferta);
                    setPostulaciones(data.postulaciones);
                }
            })
            .finally(() => setLoading(false));
    }, [ofertaId]);

    if (loading) {
        return (
            <div className="p-10 text-center text-xl animate-pulse">
                Cargando información de la vacante...
            </div>
        );
    }

    if (!oferta) {
        return <p className="p-10 text-center text-red-500">Vacante no encontrada</p>;
    }
return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Regresar */}
            <Link
                href="/Admin/BolsaTrabajoAD/VacantesInfo"
                className="inline-block mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
                ← Volver
            </Link>

            {/* Encabezado tipo “documento” */}
            <div className="bg-white p-6 rounded-xl shadow flex gap-6">
                {/* Foto de la empresa */}
                <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg border overflow-hidden">
                    {oferta.empresa_foto ? (
                        <img
                            src={oferta.empresa_foto}
                            alt={oferta.empresa}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Sin logo
                        </div>
                    )}
                </div>

                {/* Detalles de la vacante */}
                <div className="flex-1 space-y-2">
                    <h1 className="text-3xl font-extrabold">{oferta.titulo}</h1>
                    <p className="text-lg text-gray-700">
                        Empresa: <span className="font-semibold">{oferta.empresa}</span>
                    </p>
                    <p className="text-gray-600">
                        Publicada el: {getFechaLocalSinHora(oferta.fecha_publicacion).toLocaleDateString("es-MX")}
                    </p>
                    <p className="text-gray-600">
                        Creada en sistema: {getFechaLocalSinHora(oferta.creado_en).toLocaleDateString("es-MX")}
                    </p>
                    <p className="mt-2 text-gray-800 leading-relaxed">{oferta.descripcion_general}</p>
                </div>
            </div>

            {/* Postulantes */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Postulantes</h2>

                {postulaciones.length === 0 ? (
                    <p className="text-gray-500">Nadie se ha postulado aún.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Foto</th>
                                    <th className="px-4 py-2 text-left">Nombre</th>
                                    <th className="px-4 py-2 text-left">Correo</th>
                                    <th className="px-4 py-2 text-left">Teléfono</th>
                                    <th className="px-4 py-2 text-left">Estado</th>
                                    <th className="px-4 py-2 text-left">Motivo Rechazo</th>
                                    <th className="px-4 py-2 text-left">CV</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {postulaciones.map((p) => (
                                    <tr key={p.id_postulacion} className="hover:bg-gray-50">
                                        <td className="px-4 py-2">
                                            {p.foto ? (
                                                <img
                                                    src={p.foto}
                                                    alt="Foto"
                                                    className="w-12 h-12 rounded-full object-cover border"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                    —
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 font-medium">
                                            {p.nombre} {p.apellido}
                                        </td>
                                        <td className="px-4 py-2">{p.correo}</td>
                                        <td className="px-4 py-2">{p.celular ?? "—"}</td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-sm font-semibold ${
                                                    p.estadoId === 3
                                                        ? "bg-green-100 text-green-700"
                                                        : p.estadoId === 4
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {p.estado}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">{p.mensaje ?? "—"}</td> 
                                        <td className="px-4 py-2">
                                            {p.cv_url ? (
                                                <a
                                                    href={p.cv_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    Ver CV
                                                </a>
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}