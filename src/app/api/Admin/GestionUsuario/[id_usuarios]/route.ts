import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id_usuarios: string }> } // 👈 importante: Promise
) {
  try {
    const { id_usuarios } = await context.params; // 👈 await aquí
    const id = Number(id_usuarios);
    const data = await req.json();

    const sessionUser = await getSessionUser();

    if (!sessionUser || sessionUser.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Actualiza rol
    if (data.roles_id) {
      await prisma.usuarios.update({
        where: { id_usuarios: id },
        data: { roles_id: data.roles_id },
      });
    }

    // Si es egresado → actualizar perfil
    if (data.egresado) {
      await prisma.egresados.updateMany({
        where: { usuarios_id: id },
        data: {
          verificado_por_usuarios_id: data.egresado.verificado_por_usuarios_id,
          verificado_en: data.egresado.verificado_en
            ? new Date(data.egresado.verificado_en)
            : null,
        },
      });
    }
    // Si es empresa → actualizar perfil
    if (data.empresas) {
      await prisma.empresas.updateMany({
        where: { usuarios_id: id },
        data: {
          verificado_por_usuarios_id: data.empresas.verificado_por_usuarios_id,
          verificado_en: data.empresas.verificado_en
            ? new Date(data.empresas.verificado_en)
            : null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
