import { useState } from "react";

type TipoCuenta = "egresado" | "empresa";

interface Verificador {
  id_usuarios: number;
  nombre: string;
  apellido: string;
}

interface ResultadoCuenta {
  verificado?: number;
  verificado_por?: Verificador | null;
  [key: string]: unknown;
}

// Función que hace la llamada a la API
async function apiVerificarCuenta(tipo: TipoCuenta, id: number) {
  const res = await fetch(`/api/admin/verificar/${tipo}/${id}`, { method: "POST" });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Error desconocido");
  return data.data as ResultadoCuenta;
}

export function useVerificarCuenta() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verificarCuenta = async (tipo: TipoCuenta, id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiVerificarCuenta(tipo, id);
      return data;
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : "Error desconocido";
      setError(mensaje);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { verificarCuenta, loading, error };
}
