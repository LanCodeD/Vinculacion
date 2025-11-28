'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

interface UploadProps {
  userId: number;
  tipo: 'cv' | 'foto_usuario' | 'imagen_oferta';
  idEgresado?: number;
  onUploaded?: (url: string) => void;
}

export default function UploadFile({ userId, tipo, idEgresado, onUploaded }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const isImage = tipo !== "cv";

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId.toString());
    formData.append("tipo", tipo);

    if (tipo === "cv" && idEgresado) {
      formData.append("idEgresado", idEgresado.toString());
    }

    try {
      const res = await fetch("/api/Admin/BolsaTrabajo/Subir_IMG_PDF", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.ok && data.url) {
        toast.success("Archivo subido correctamente");
        onUploaded?.(data.url);
      } else {
        toast.error("Error al subir archivo");
      }
    } catch (err) {
      toast.error("Error al subir archivo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 flex items-center gap-3">

      {/* Campo compacto */}
      <label className="cursor-pointer bg-gray-100 text-gray-700 border border-gray-300 rounded px-3 py-1.5 text-sm hover:bg-gray-200 transition">
        Seleccionar archivo
        <input
          type="file"
          className="hidden"
          accept={isImage ? "image/*" : ".pdf,.doc,.docx"}
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
      </label>

      {/* Botón elegante */}
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm text-white transition
          ${!file || loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
        `}
      >
        <Upload size={16} />
        {loading ? "Subiendo..." : "Subir"}
      </button>
    </div>
  );
}
