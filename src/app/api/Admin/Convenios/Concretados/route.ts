import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth"; // ⚠️ ya lo usas antes, así que mantenemos consistencia
import { writeFile } from "fs/promises";
import fs from "fs/promises";
import path from "path";

// 📌 Obtener todos los convenios concretados
// 📌 Obtener todos los convenios concretados
export async function GET() {
  try {
    const convenios = await prisma.convenio_concretado.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id_convenio_concretado: true,
        documento_ruta: true,
        fecha_firmada: true,
        vigencia: true,
        fecha_expira: true,
        unidad_vigencia: true,
        estado_dinamico: true, // 👈 ya lo traemos directamente desde la BD
        created_at: true,
        updated_at: true,
        solicitud: {
          select: {
            id_solicitud: true,
            creador: { select: { nombre: true, correo: true } },
            estado: { select: { nombre_estado: true } },
            tipo: { select: { nombre_tipo: true } },
            solicitud_firmas_origen: {
              select: {
                firma: { select: { nombre: true } },
              },
            },
          },
        },
      },
    });

    // 🖌️ Asignar color según el estado dinámico (solo visual)
    const conveniosConColor = convenios.map((c) => {
      let color_estado = "text-gray-500";
      switch (c.estado_dinamico) {
        case "ACTIVO":
          color_estado = "text-green-700";
          break;
        case "PRÓXIMO A VENCER":
          color_estado = "text-orange-500";
          break;
        case "VENCIDO":
          color_estado = "text-red-600";
          break;
      }

      return { ...c, color_estado };
    });

    return NextResponse.json(conveniosConColor);
  } catch (error) {
    console.error("❌ Error al obtener convenios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// 📌 Crear un nuevo convenio concretado
// 🔧 Función auxiliar para verificar si un archivo ya existe
async function fileExists(ruta: string): Promise<boolean> {
  try {
    await fs.access(ruta);
    return true;
  } catch {
    return false;
  }
}

// 📘 Tipos para claridad
type EstadoConvenio = "ACTIVO" | "PRÓXIMO A VENCER" | "VENCIDO" | "SIN FECHA";

// 🔹 Función auxiliar igual que en tu cron job
function obtenerEstadoDinamico(fechaExpira: Date | string | null): EstadoConvenio {
  if (!fechaExpira) return "SIN FECHA";

  const hoy = new Date();
  const expira = new Date(fechaExpira);
  const diferenciaMeses =
    (expira.getFullYear() - hoy.getFullYear()) * 12 +
    (expira.getMonth() - hoy.getMonth());

  if (expira < hoy) return "VENCIDO";
  if (diferenciaMeses < 6) return "PRÓXIMO A VENCER";
  return "ACTIVO";
}

// 📌 Crear un convenio concretado
export async function POST(req: NextRequest) {
  try {
    const usuario = await getSessionUser();

    // 🔐 Validar permisos
    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const formData = await req.formData();

    const id_solicitud = Number(formData.get("id_solicitud"));
    const fecha_firmada = formData.get("fecha_firmada") as string;
    const vigencia = formData.get("vigencia") as string;
    const unidad_vigencia = formData.get("unidad_vigencia") as string;
    const archivo = formData.get("documento") as File | null;

    if (!id_solicitud || !fecha_firmada || !vigencia || !unidad_vigencia) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // 📦 Guardar archivo (si existe)
    let documento_ruta: string | null = null;

    if (archivo) {
      const bytes = await archivo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const carpetaDestino = path.join(
        process.cwd(),
        "uploads",
        "Subir_documentos",
        "convenios_concretados"
      );

      await fs.mkdir(carpetaDestino, { recursive: true });

      const nombreOriginal = archivo.name;
      const extension = path.extname(nombreOriginal);
      const base = path.basename(nombreOriginal, extension);

      let nombreFinal = nombreOriginal;
      let ruta = path.join(carpetaDestino, nombreFinal);
      let contador = 1;

      // Evitar duplicados
      while (await fileExists(ruta)) {
        nombreFinal = `${base}_${contador}${extension}`;
        ruta = path.join(carpetaDestino, nombreFinal);
        contador++;
      }

      await writeFile(ruta, buffer);

      documento_ruta = `/api/Admin/archivos/Subir_documentos/convenios_concretados/${nombreFinal}`;
    }

    // 🧮 Calcular fecha de expiración
    const cantidad = parseInt(vigencia);
    let fecha_expira: Date | null = null;

    if (!isNaN(cantidad)) {
      const fecha = new Date(fecha_firmada);

      switch (unidad_vigencia.toLowerCase()) {
        case "año":
        case "años":
          fecha.setFullYear(fecha.getFullYear() + cantidad);
          break;
        case "mes":
        case "meses":
          fecha.setMonth(fecha.getMonth() + cantidad);
          break;
        case "día":
        case "días":
          fecha.setDate(fecha.getDate() + cantidad);
          break;
        default:
          console.warn("Unidad de vigencia no reconocida:", unidad_vigencia);
      }

      fecha_expira = fecha;
    }

    // 🔍 Calcular el estado dinámico al crear
    const estado_dinamico = obtenerEstadoDinamico(fecha_expira);

    // 🧠 Transacción para crear el convenio y actualizar la solicitud
    const resultado = await prisma.$transaction(async (tx) => {
      // 1️⃣ Validar solicitud existente y sin convenio previo
      const solicitud = await tx.solicitud_convenios.findUnique({
        where: { id_solicitud },
        include: { convenio_concretado: true },
      });

      if (!solicitud) throw new Error("La solicitud no existe.");
      if (solicitud.estado_id !== 6)
        throw new Error("La solicitud no está finalizada.");
      if (solicitud.convenio_concretado)
        throw new Error("Esta solicitud ya tiene un convenio concretado.");

      // 2️⃣ Crear el convenio concretado
      const nuevoConvenio = await tx.convenio_concretado.create({
        data: {
          id_solicitud,
          fecha_firmada: new Date(fecha_firmada),
          vigencia,
          unidad_vigencia,
          fecha_expira,
          documento_ruta,
          estado_dinamico, // 🟢 Nuevo campo agregado
        },
      });

      // 3️⃣ Actualizar el estado de la solicitud (7 = CONVENIO CONCRETADO)
      await tx.solicitud_convenios.update({
        where: { id_solicitud },
        data: { estado_id: 7 },
      });

      // 4️⃣ Devolver el registro completo
      return await tx.convenio_concretado.findUnique({
        where: { id_convenio_concretado: nuevoConvenio.id_convenio_concretado },
        select: {
          id_convenio_concretado: true,
          documento_ruta: true,
          fecha_firmada: true,
          vigencia: true,
          unidad_vigencia: true,
          fecha_expira: true,
          estado_dinamico: true,
          created_at: true,
          updated_at: true,
          solicitud: {
            select: {
              id_solicitud: true,
              tipo: { select: { nombre_tipo: true } },
              creador: { select: { nombre: true, correo: true } },
              estado: { select: { nombre_estado: true } },
              solicitud_firmas_origen: {
                select: {
                  firma: { select: { nombre: true } },
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(resultado, { status: 201 });
  } catch (error) {
    console.error("Error al crear convenio concretado:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

