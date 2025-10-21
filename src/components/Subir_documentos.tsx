'use client';
import { useState } from 'react';

interface UploadProps {
  userId: number;
  tipo: 'cv' | 'foto_usuario'; // Cambiado para foto de perfil global
  onUploaded?: (url: string) => void;
}

export default function UploadFile({ userId, tipo, onUploaded }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId.toString());
    formData.append("tipo", tipo);

    try {
      const res = await fetch("/api/Users/Subir_archivos", { method: "POST", body: formData });
      const data = await res.json();
      if (data.ok && data.url && onUploaded) {
        onUploaded(data.url);
      } else {
        alert("Error al subir archivo: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al subir archivo");
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
