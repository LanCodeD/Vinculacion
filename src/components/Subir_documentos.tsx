// src/components/Subir_documentos.tsx
'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface UploadProps {
  userId: number;
  tipo: 'cv' | 'foto_usuario' | 'imagen_oferta'; // Cambiado para foto de perfil global
  idEgresado?: number;
  onUploaded?: (url: string) => void;
}

export default function UploadFile({ userId, tipo, idEgresado, onUploaded }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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
      const res = await fetch("/api/Admin/BolsaTrabajo/Subir_IMG_PDF", { method: "POST", body: formData });
      const data = await res.json();
      if (data.ok && data.url && onUploaded) {
        onUploaded(data.url);
      } else {
        toast("Error al subir archivo: " + data.error);
      }
    } catch (err) {
      console.error(err);
      toast("Error al subir archivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <input
        type="file"
        accept={tipo === 'cv' ? ".pdf,.doc,.docx" : "image/*"}
        onChange={e => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading || !file}
      >
        {loading ? "Subiendo..." : "Subir"}
      </button>
    </div>
  );
}
