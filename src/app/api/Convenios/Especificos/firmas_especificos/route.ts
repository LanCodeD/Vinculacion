// app/api/Convenios/firma_origen/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Endpoint: obtener lista de opciones de firma de origen
export async function GET() {
  try {
    const firmas = await prisma.firma_origen.findMany({
      where: {
        id_firma: {
          gte: 9,
          lte: 12,
        },
      },
      select: {
        id_firma: true,
        nombre: true,
      },
      orderBy: { id_firma: "asc" },
    });

    return NextResponse.json(firmas);
  } catch (error) {
    console.error("Error al obtener firmas de origen:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
