import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const tipo = formData.get("tipo") as "cv" | "foto_usuario";

    if (!file || !userId || !tipo) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let uploadDir = path.join(process.cwd(), "public", "Subir_documentos");
    if (tipo === "cv") uploadDir = path.join(uploadDir, "documentos_egresados");
    if (tipo === "foto_usuario") uploadDir = path.join(uploadDir, "fotos_usuarios");

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    const publicPath = filePath.split("public")[1].replace(/\\/g, "/");

    // Guardar en BD
    if (tipo === "cv") {
      await prisma.egresados.updateMany({
        where: { usuarios_id: parseInt(userId) },
        data: { cv_url: publicPath },
      });
    } else if (tipo === "foto_usuario") {
      await prisma.usuarios.update({
        where: { id_usuarios: parseInt(userId) },
        data: { foto_perfil: publicPath }, // nuevo campo en usuarios
      });
    }

    return NextResponse.json({ ok: true, url: publicPath });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });
  }
};
