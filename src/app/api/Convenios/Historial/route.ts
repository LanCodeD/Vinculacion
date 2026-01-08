import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const usuario = await getSessionUser();
    if (!usuario) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const solicitudes = await prisma.solicitud_convenios.findMany({
      where: { creado_por_usuario_id: usuario.id },
      orderBy: { created_at: "desc" },
      select: {
        id_solicitud: true,
        tipo_solicitud_id: true,
        creado_por_usuario_id: true,
        estado: { select: { nombre_estado: true } }, // Estado de la solicitud
        tipo: { select: { nombre_tipo: true } },
        detalle: {select: {dependencia_nombre: true}}, // nombre de la dependencia colocada en la solicitud
        solicitud_firmas_origen: {
          select: { firma: { select: { nombre: true } } },
        },
        convenio_concretado: {
          select: {
            documento_ruta: true,
            fecha_firmada: true,
            vigencia: true,
            unidad_vigencia: true,
            fecha_expira: true,
            estado_dinamico: true,
          },
        },
      },
    });

    // 🎨 Asignar color visual según estado dinámico
    const solicitudesConColor = solicitudes.map((s) => {
      let color_estado = "text-gray-500";
      switch (s.convenio_concretado?.estado_dinamico) {
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

      return { ...s, color_estado };
    });

    return NextResponse.json(solicitudesConColor);
  } catch (error) {
    console.error("❌ Error al obtener solicitudes:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
