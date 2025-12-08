import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id_grupos: string }> }
) {
  try {
    const usuario = await getSessionUser();
    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id_grupos } = await context.params;
    const id = parseInt(id_grupos, 10);
    const body = await req.json();

    if (!body.nombre_grupo || body.nombre_grupo.trim() === "") {
      return NextResponse.json(
        { error: "El nombre del grupo es obligatorio" },
        { status: 400 }
      );
    }

    const grupoActualizado = await prisma.grupos.update({
      where: { id_grupos: id },
      data: {
        nombre_grupo: body.nombre_grupo.trim(),
        actualizado_en: new Date(),
      },
      select: {
        id_grupos: true,
        nombre_grupo: true,
        actualizado_en: true,
      },
    });

    return NextResponse.json(grupoActualizado, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error al actualizar grupo:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un grupo con ese nombre" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id_grupos: string }> }
){
  try {
    const usuario = await getSessionUser();
    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id_grupos } = await context.params;
    const id = parseInt(id_grupos, 10);

    await prisma.grupos.delete({
      where: { id_grupos: id },
    });

    return NextResponse.json({ message: "Grupo eliminado correctamente" });
  } catch (error: any) {
    console.error("❌ Error al eliminar grupo:", error);

    // Prisma lanza error de restricción referencial si hay contactos asociados
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "No puedes eliminar este grupo porque tiene contactos asociados. Asigna esos contactos a otro grupo o elimínalos primero.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
