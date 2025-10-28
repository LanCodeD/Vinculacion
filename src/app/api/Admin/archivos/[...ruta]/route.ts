// /src/app/api/archivos/[...ruta]/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getSessionUser } from "@/lib/auth"; // ⚠️ ya lo usas antes, así que mantenemos consistencia

function sanitizeParts(parts: string[]) {
  // Evitamos que nadie suba rutas con .. o rutas absolutas
  return parts.filter((p) => p && !p.includes("..") && !path.isAbsolute(p));
}

function mimeFromExt(ext: string) {
  switch (ext.toLowerCase()) {
    case ".pdf":
      return "application/pdf";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".doc":
      return "application/msword";
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case ".txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  req: Request,
  context: { params: { ruta: string[] } }
) {
  const rutaParts = context.params.ruta;
  console.log("🔍 Ruta solicitada:", rutaParts);
  try {
    // dentro de GET, arriba
    const user = await getSessionUser();
    if (!user || user.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const safeParts = sanitizeParts(rutaParts);

    if (safeParts.length === 0) {
      return NextResponse.json({ error: "Ruta no válida" }, { status: 400 });
    }

    // Aseguramos que la ruta inicie en la carpeta esperada (opcional pero recomendable)
    // p.ej: exigimos que la primera parte sea "Subir_documentos"
    if (safeParts[0] !== "Subir_documentos") {
      return NextResponse.json(
        { error: "Acceso restringido" },
        { status: 403 }
      );
    }

    const filePath = path.join(process.cwd(), "uploads", ...safeParts);

    console.log("Ruta solicitada:", rutaParts);
    console.log("Ruta segura:", safeParts);
    console.log("Ruta física:", filePath);

    // Verificamos existencia
    await fs.access(filePath);

    const ext = path.extname(filePath);

    // Validar tipo de archivo permitido
    if (
      ![".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".txt"].includes(ext)
    ) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido" },
        { status: 415 }
      );
    }

    const buffer = await fs.readFile(filePath);
    const uint8 = new Uint8Array(buffer);
    const mime = mimeFromExt(ext);

    return new Response(uint8, {
      status: 200,
      headers: {
        "Content-Type": mime,
      },
    });
  } catch (err: any) {
    console.error("Error al servir archivo:", err?.message || err);
    return NextResponse.json(
      { error: "Archivo no encontrado" },
      { status: 404 }
    );
  }
}
