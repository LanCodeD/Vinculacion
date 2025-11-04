// src/app/api/Users/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface UsuarioExpandido {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  celular: string | null;
  rol: string;
  tipoCuenta: string;
  last_login: Date | null;
  paso_actual: number;
  permisos: string[];
  imagen_perfil: string | null;
  egresados?: {
    id_egresados: number;
    titulo: string | null;
    puesto: string | null;
    matricula: string;
    fecha_egreso: string | null;
    correo_institucional: string | null;
    cv_url: string | null;
  }[];
  empresas?: {
    id_empresas: number;
    nombre_comercial: string;
    razon_social: string | null;
    rfc: string;
    direccion: string | null;
    correo: string | null;
    telefono: string | null;
  }[];
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // 👈 Se espera el contexto
  const userId = parseInt(id);

  if (isNaN(userId))
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const user = await prisma.usuarios.findUnique({
      where: { id_usuarios: userId },
      include: {
        tipos_cuenta: true,
        roles: {
          include: {
            roles_permisos: {
              include: { permisos: true },
            },
          },
        },
        egresados_perfil: true,
        empresas_perfil: true,
      },
    });

    if (!user)
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );

    const permisos =
      user.roles.roles_permisos?.map((rp) => rp.permisos.nombre) || [];

    const data: UsuarioExpandido = {
      id: user.id_usuarios,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      celular: user.celular,
      rol: user.roles.nombre,
      tipoCuenta: user.tipos_cuenta.nombre,
      last_login: user.last_login,
      paso_actual: user.paso_actual,
      permisos,
      imagen_perfil: user.foto_perfil || null,
    };

    if (user.roles.nombre === "Egresado" && user.egresados_perfil.length > 0) {
      data.egresados = user.egresados_perfil.map((e) => ({
        id_egresados: e.id_egresados,
        titulo: e.titulo,
        puesto: e.puesto,
        matricula: e.matricula,
        fecha_egreso: e.fecha_egreso ? e.fecha_egreso.toISOString() : null,
        correo_institucional: e.correo_institucional,
        cv_url: e.cv_url,
      }));
    }

    if (user.roles.nombre === "Empresa" && user.empresas_perfil.length > 0) {
      data.empresas = user.empresas_perfil.map((emp) => ({
        id_empresas: emp.id_empresas,
        nombre_comercial: emp.nombre_comercial,
        razon_social: emp.razon_social,
        rfc: emp.rfc,
        direccion: emp.direccion,
        correo: emp.correo,
        telefono: emp.telefono,
      }));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
