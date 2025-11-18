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
    const { tipo, nombre } = await context.params;

    console.log("==============");
    console.log("📥 Solicitud de archivo");
    console.log("Tipo:", tipo);
    console.log("Nombre:", nombre);

    // -------------------------------------
    // 🔐 1. Archivos públicos
    // -------------------------------------
    if (tipo === "Perfiles") {
      console.log("🟢 Acceso libre (Perfiles)");
    } else {
      // -------------------------------------
      // 🔐 2. Archivos protegidos
      // -------------------------------------
      const user = await getSessionUser();
      console.log("👤 Usuario en sesión:", user);

      if (!user) {
        console.log("❌ No hay sesión → 401");
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }

      // Roles permitidos para documentos
      const rolesPermitidos = ["Administrador", "Empresa", "Egresado"];
      console.log("Roles permitidos:", rolesPermitidos);

      if (!rolesPermitidos.includes(user.role)) {
        console.log("❌ Rol NO permitido:", user.role);
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }

      // -------------------------------------
      // 🔐 3. Egresado solo puede ver SU propio CV
      // -------------------------------------
      if (tipo === "Egresados_Documentos") {
        console.log("📄 Archivo es CV");

        const idArchivo = Number(nombre.replace("cv_", "").split(".")[0]);
        console.log("ID detectado en archivo:", idArchivo);

        if (user.role === "Egresado") {
          console.log("👤 Usuario es EGRESADO con ID:", user.id);

          if (user.id !== idArchivo) {
            console.log("❌ El egresado intenta ver un CV ajeno");
            return NextResponse.json(
              { error: "No puedes acceder al CV de otro usuario" },
              { status: 403 }
            );
          }

          console.log("🟢 Egresado autorizado a ver SU CV");
        }
      }
    }

    // -------------------------------------
    // 📂 Validar tipo permitido
    // -------------------------------------
    if (!["Perfiles", "Egresados_Documentos", "Ofertas"].includes(tipo)) {
      console.log("❌ Tipo NO permitido:", tipo);
      return NextResponse.json({ error: "Tipo no permitido" }, { status: 400 });
    }

    // -------------------------------------
    // 📁 Construir ruta
    // -------------------------------------
    const basePath = process.cwd();
    const carpeta =
      tipo === "Perfiles" || tipo === "Ofertas"
        ? "Subir_imagenes"
        : "Subir_documentos";

    const filePath = path.join(basePath, "uploads", carpeta, tipo, nombre);

    console.log("📁 Ruta física del archivo:", filePath);

    await fs.access(filePath);
    console.log("🟢 Archivo encontrado en el sistema");

    const fileBuffer = await fs.readFile(filePath);
    const fileStats = await fs.stat(filePath);
    const mime = mimeFromExt(path.extname(filePath).toLowerCase());

    console.log("📤 Sirviendo archivo con MIME:", mime);

    const arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength
    ) as ArrayBuffer;

    console.log("🟢 Archivo entregado con éxito");
    console.log("==============");

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Length": fileStats.size.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });

  } catch (err: unknown) {
    const mensaje =
      err instanceof Error ? err.message : "Error desconocido al acceder al archivo";

    console.log("❌ ERROR general:", mensaje);
    console.log("==============");

    return NextResponse.json(
      { error: "Archivo no encontrado", detalle: mensaje },
      { status: 404 }
    );
  }
}
