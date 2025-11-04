import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getSessionUser } from "@/lib/auth";

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
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ tipo: string; nombre: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    // Corregido: await context.params
    const { tipo, nombre } = await context.params;

    if (!["Perfiles", "Egresados_Documentos"].includes(tipo)) {
      return NextResponse.json({ error: "Tipo no permitido" }, { status: 400 });
    }

    const basePath = process.cwd();
    const carpeta = tipo === "Perfiles" ? "Subir_imagenes" : "Subir_documentos";
    const filePath = path.join(basePath, "uploads", carpeta, tipo, nombre);

    await fs.access(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const buffer = await fs.readFile(filePath);
    const mime = mimeFromExt(ext);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: { "Content-Type": mime },
    });
  } catch (err: unknown) {
    const mensaje =
      err instanceof Error
        ? err.message
        : "Error desconocido al acceder al archivo";
    console.error("❌ Error al servir archivo:", mensaje);
    return NextResponse.json(
      { error: "Archivo no encontrado" },
      { status: 404 }
    );
  }
}
