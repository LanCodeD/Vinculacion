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
    correo_empresas: string | null;
    telefono: string | null;
  }[];
  docentes?: {
    id_docentes: number;
    titulo: string | null;
    puesto: string | null;
  }[];
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userId = parseInt(id);
  const body = await req.json();

  try {
    // Actualiza datos del usuario
    await prisma.usuarios.update({
      where: { id_usuarios: userId },
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        celular: body.celular,
        correo: body.correo,
      },
    });

    // Si el usuario es egresado, actualiza todos los perfiles de egresado asociados
    if (body.egresados && Array.isArray(body.egresados)) {
      for (const eg of body.egresados) {
        await prisma.egresados.update({
          where: { id_egresados: eg.id_egresados },
          data: {
            titulo: eg.titulo,
            puesto: eg.puesto,
            correo_institucional: eg.correo_institucional,
          },
        });
      }
    }


    // Si es empresa, actualiza su perfil empresarial
    if (body.empresas && Array.isArray(body.empresas)) {
      for (const emp of body.empresas) {
        await prisma.empresas.update({
          where: { id_empresas: emp.id_empresas },
          data: {
            nombre_comercial: emp.nombre_comercial,
            razon_social: emp.razon_social,
            rfc: emp.rfc,
            direccion: emp.direccion,
            correo_empresas: emp.correo_empresas,
            telefono: emp.telefono,
          },
        });
      }
    }

    // 🔹 Si el usuario tiene perfil de docente
    if (body.docentes && Array.isArray(body.docentes)) {
      for (const doc of body.docentes) {
        await prisma.docentes.update({
          where: { id_docentes: doc.id_docentes },
          data: {
            titulo: doc.titulo,
            puesto: doc.puesto,
          },
        });
      }
    }

    // 🔄 Obtener el usuario actualizado
    const updatedUser = await prisma.usuarios.findUnique({
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
        docentes: true,
      },
    });

    // Estructurar igual que en el GET
    const permisos = updatedUser?.roles.roles_permisos?.map((rp) => rp.permisos.nombre) || [];
    const userData = {
      id: updatedUser?.id_usuarios,
      nombre: updatedUser?.nombre,
      apellido: updatedUser?.apellido,
      correo: updatedUser?.correo,
      celular: updatedUser?.celular,
      rol: updatedUser?.roles.nombre,
      tipoCuenta: updatedUser?.tipos_cuenta.nombre,
      last_login: updatedUser?.last_login,
      paso_actual: updatedUser?.paso_actual,
      permisos,
      imagen_perfil: updatedUser?.foto_perfil || null,
      egresados: updatedUser?.egresados_perfil || [],
      empresas: updatedUser?.empresas_perfil || [],
      docentes: updatedUser?.docentes || [],
    };

    return NextResponse.json({ ok: true, mensaje: "Perfil actualizado correctamente", user: userData });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    return NextResponse.json({ error: "Error interno al actualizar" }, { status: 500 });
  }
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
        docentes: true,
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
        correo_empresas: emp.correo_empresas,
        telefono: emp.telefono,
      }));
    }

    if (user.docentes.length > 0) {
      data.docentes = user.docentes.map((doc) => ({
        id_docentes: doc.id_docentes,
        titulo: doc.titulo,
        puesto: doc.puesto,
      }));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
