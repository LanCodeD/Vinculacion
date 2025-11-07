// src/app/api/Admin/BolsaTrabajo/Subir_IMG_PDF/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = Number(formData.get("userId"));
    const tipo = formData.get("tipo") as "cv" | "foto_usuario" | "imagen_oferta";
    const idEgresado = Number(formData.get("idEgresado"));

    if (!file || !userId || !tipo) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    if (
      tipo === "cv" &&
      user.role !== "Egresado" &&
      user.role !== "Administrador"
    ) {
      return NextResponse.json(
        { error: "Solo egresados pueden subir CVs" },
        { status: 403 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const basePath = process.cwd();
    let carpetaDestino: string;
    let rutaBaseAPI: string;

    if (tipo === "cv") {
      carpetaDestino = path.join(
        basePath,
        "uploads",
        "Subir_documentos",
        "Egresados_Documentos"
      );
      rutaBaseAPI = "/api/Usuarios/archivos/Egresados_Documentos";
    } else if (tipo === "imagen_oferta") {
      carpetaDestino = path.join(
        basePath,
        "uploads",
        "Subir_imagenes",
        "Ofertas"
      );
      rutaBaseAPI = "/api/Usuarios/archivos/Ofertas";
    } else {
      carpetaDestino = path.join(
        basePath,
        "uploads",
        "Subir_imagenes",
        "Perfiles"
      );
      rutaBaseAPI = "/api/Usuarios/archivos/Perfiles";
    }

    await fs.mkdir(carpetaDestino, { recursive: true });

    // Puedes dar un nombre específico al archivo, ejemplo: 'perfil_33.png' o 'cv_45.pdf'
    const extension = path.extname(file.name);

    let nombreFinal: string;

    if (tipo === "foto_usuario") {
      nombreFinal = `perfil_${userId}${extension}`;
    } else if (tipo === "imagen_oferta") {
      nombreFinal = `oferta_${userId}_${Date.now()}${extension}`;
    } else {
      nombreFinal = `cv_${idEgresado || userId}${extension}`;
    }

    const rutaFinal = path.join(carpetaDestino, nombreFinal);

    await fs.writeFile(rutaFinal, buffer);
    const urlArchivo = `${rutaBaseAPI}/${encodeURIComponent(nombreFinal)}`;

    // Guardar en BD
    if (tipo === "cv") {
      await prisma.egresados.update({
        where: { id_egresados: idEgresado },
        data: { cv_url: urlArchivo },
      });
    } else if (tipo === "foto_usuario") {
      await prisma.usuarios.update({
        where: { id_usuarios: userId },
        data: { foto_perfil: urlArchivo },
      });
    }

    return NextResponse.json({
      ok: true,
      url: urlArchivo,
      nombre: nombreFinal, // 👈 se agrega para usarlo en el front
      tipo,
      mensaje: "Archivo subido correctamente",
    });
  } catch (error: unknown) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error desconocido al subir archivo";
    console.error("❌ Error al subir archivo:", mensaje);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
