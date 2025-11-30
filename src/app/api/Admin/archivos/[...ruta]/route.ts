import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function sanitizeParts(parts: string[]) {
  return parts.filter((p) => p && !p.includes("..") && !path.isAbsolute(p));
}

function mimeFromExt(ext: string) {
  switch (ext.toLowerCase()) {
    case ".pdf": return "application/pdf";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".png": return "image/png";
    case ".doc": return "application/msword";
    case ".docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case ".txt": return "text/plain";
    default: return "application/octet-stream";
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ ruta: string[] }> }
) {
  const { ruta: rutaParts } = await context.params;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const safeParts = sanitizeParts(rutaParts);
    if (safeParts.length === 0) {
      return NextResponse.json({ error: "Ruta no válida" }, { status: 400 });
    }

    if (safeParts[0] !== "Subir_documentos") {
      return NextResponse.json({ error: "Acceso restringido" }, { status: 403 });
    }

    // 📌 Aquí obtenemos el nombre del archivo
    const fileName = safeParts[safeParts.length - 1];

    // 📌 Buscamos el convenio que tenga ese documento
    const convenio = await prisma.convenio_concretado.findFirst({
      where: { documento_ruta: { contains: fileName } },
      include: { solicitud: true },
    });

    if (!convenio) {
      return NextResponse.json({ error: "Convenio no encontrado" }, { status: 404 });
    }

    // 📌 Validamos permisos
    const esAdmin = user.role === "Administrador";
    const esCreador = convenio.solicitud.creado_por_usuario_id === user.id;

    if (!esAdmin && !esCreador) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const filePath = path.join(process.cwd(), "uploads", ...safeParts);
    await fs.access(filePath);

    const ext = path.extname(filePath);
    if (![".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".txt"].includes(ext)) {
      return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 415 });
    }

    const buffer = await fs.readFile(filePath);
    const uint8 = new Uint8Array(buffer);
    const mime = mimeFromExt(ext);

    return new Response(uint8, {
      status: 200,
      headers: { "Content-Type": mime },
    });
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error desconocido al servir archivo";
    console.error("Error al servir archivo:", mensaje);
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }
}
