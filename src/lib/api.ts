// utils/api.ts
export async function verificarCuenta(tipo: "egresado" | "empresa", id: string) {
  try {
    const res = await fetch(`/api/verificar/${tipo}/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body no es necesario si solo usas params en la URL
      // body: JSON.stringify({ ... }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error desconocido");
    }

    return data.data; // Aquí está el resultado de la API
  } catch (err) {
    console.error("Error al verificar:", err);
    throw err;
  }
}
