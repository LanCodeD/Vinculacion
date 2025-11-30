// api/Notificaciones/leer/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptionsCredencial";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { ok: false, error: "No autorizado" },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const idNumber = parseInt(id);

        if (isNaN(idNumber)) {
            return NextResponse.json(
                { ok: false, error: "ID inválido" },
                { status: 400 }
            );
        }

        // Marcar solo la notificación específica como leída
        await prisma.notificaciones.update({
            where: { id_notificaciones: idNumber },
            data: { leido: true },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("❌ Error al marcar notificación como leída:", error);
        return NextResponse.json(
            { ok: false, error: "Error interno" },
            { status: 500 }
        );
    }
}
