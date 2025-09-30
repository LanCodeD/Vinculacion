import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  if (!userId) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const user = await prisma.usuarios.findUnique({
      where: { id_usuarios: userId },
      include: {
        tipos_cuenta: true,       // 🔹 Incluimos relación
        roles: true,              // 🔹 Incluimos relación
        egresados_perfil: true,   // 🔹 Incluimos relación
        empresas_perfil: true,    // opcional según rol
      },
    });

    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    // Filtrar campos según rol
    const data: any = {
      id: user.id_usuarios,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      celular: user.celular,
      rol: user.roles.nombre,
      tipoCuenta: user.tipos_cuenta.nombre,
      last_login: user.last_login,
      paso_actual: user.paso_actual,
    };

    if (user.roles.nombre === "Egresado") {
      data.egresados = user.egresados_perfil;
    }

    if (user.roles.nombre === "Administrador") {
      data.empresas = user.empresas_perfil;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
