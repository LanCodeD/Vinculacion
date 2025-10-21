// src/app/api/Ingenierias/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ingenierias = await prisma.academias_ingenierias.findMany({
      select: { id_academias: true, ingenieria: true },
      orderBy: { id_academias: "asc" },
    });

    return NextResponse.json({ ok: true, ingenierias });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Error al obtener ingenierías" }, { status: 500 });
  }
}
