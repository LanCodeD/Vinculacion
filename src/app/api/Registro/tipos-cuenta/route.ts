import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tiposCuenta = await prisma.tipos_cuenta.findMany({
    select: { id_tipos_cuenta: true, nombre: true },
  });
  return NextResponse.json(tiposCuenta);
}
