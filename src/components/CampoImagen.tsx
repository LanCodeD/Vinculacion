"use client";
import Image from "next/image";
import UploadFile from "@/components/Subir_documentos";

interface CampoImagenProps {
    user: {
        id: number;
        nombre?: string;
        correo?: string;
        rol?: string;
    };
    imagen: string;
    setImagen: (url: string) => void;
}

export default function CampoImagen({ user, imagen, setImagen }: CampoImagenProps) {
    const obtenerNombreArchivo = (url: string) => {
        const partes = url.split("/");
        return decodeURIComponent(partes[partes.length - 1]);
    };

    return (
        <div>
            <label className="block font-medium mb-1">Imagen *</label>

            {/* Campo que muestra el nombre del archivo */}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={imagen ? obtenerNombreArchivo(imagen) : ""}
                    readOnly
                    placeholder="No se ha subido ninguna imagen"
                    className="w-full border p-2 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                />

                {/* Botón para subir imagen */}
                <UploadFile
                    userId={user.id}
                    tipo="imagen_oferta" // 👈 ahora guarda en /uploads/Subir_imagenes/Ofertas
                    onUploaded={(url) => setImagen(url)}
                />
            </div>

            {/* Previsualización */}
            {imagen && (
                <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-1">Previsualización:</p>
                    <Image
                        src={imagen}
                        alt="Previsualización"
                        width={800}
                        height={320}
                        className="w-full rounded-lg border h-40 object-cover"
                        unoptimized
                    />
                </div>
            )}
        </div>
    );
}
