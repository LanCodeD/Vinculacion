import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const usuario = await getSessionUser();

    // 🔒 Solo un administrador puede listar usuarios
    if (!usuario || usuario.role !== "Administrador") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // 📦 Obtener todos los usuarios con sus posibles perfiles
    const usuarios = await prisma.usuarios.findMany({
      orderBy: { id_usuarios: "asc" },
      select: {
        id_usuarios: true,
        nombre: true,
        apellido: true,
        correo: true,
        celular: true,
        tipos_cuenta_id: true,
        roles_id: true,
        foto_perfil: true,
        tipos_cuenta: { select: { nombre: true } },
        roles: { select: { nombre: true } },

        // 🎓 Perfil de egresado
        egresados_perfil: {
          select: {
            id_egresados: true,
            matricula: true,
            titulo: true,
            puesto: true,
            fecha_egreso: true,
            correo_institucional: true,
            academias_ingenierias: { select: { ingenieria: true } },
            empresas: { select: { nombre_comercial: true } },
            verificado_en: true,
            verificado_por_usuarios_id: true,
            verificado_por: {
              select: { nombre: true, apellido: true, correo: true },
            },
          },
        },

        // 👨‍🏫 Perfil de docente
        docentes: {
          select: {
            id_docentes: true,
            titulo: true,
            puesto: true,
            empresas: { select: { nombre_comercial: true } },
          },
        },

        // 🏢 Perfil de empresa
        empresas_perfil: {
          select: {
            id_empresas: true,
            nombre_comercial: true,
            razon_social: true,
            rfc: true,
            direccion: true,
            telefono: true,
            correo_empresas: true,
            puesto: true,
            verificado_en: true,
            verificado: true,
            verificado_por_usuarios_id: true,
            verificado_por: {
              select: { nombre: true, apellido: true, correo: true },
            },
          },
        },


      },
    });

    // 🧠 Normalizar perfiles: convertir arrays en objetos o null
    const usuariosNormalizados = usuarios.map((u) => ({
      ...u,
      egresados_perfil:
        Array.isArray(u.egresados_perfil) && u.egresados_perfil.length > 0
          ? u.egresados_perfil[0]
          : null,
      docentes:
        Array.isArray(u.docentes) && u.docentes.length > 0
          ? u.docentes[0]
          : null,
      empresas_perfil:
        Array.isArray(u.empresas_perfil) && u.empresas_perfil.length > 0
          ? u.empresas_perfil[0]
          : null,
    }));

    // ⚙️ Filtrar según tipo de cuenta para no enviar datos innecesarios
    const usuariosFiltrados = usuariosNormalizados.map((u) => {
      const tipoCuenta = u.tipos_cuenta?.nombre;

      const base = {
        id_usuarios: u.id_usuarios,
        nombre: u.nombre,
        apellido: u.apellido,
        correo: u.correo,
        celular: u.celular,
        tipos_cuenta: u.tipos_cuenta,
        roles: u.roles,
        foto_perfil: u.foto_perfil,
      };

      if (tipoCuenta === "Egresado") {
        return { ...base, egresados_perfil: u.egresados_perfil };
      }

      if (tipoCuenta === "Docente") {
        return { ...base, docentes: u.docentes };
      }

      if (tipoCuenta === "Empresa") {
        return { ...base, empresas_perfil: u.empresas_perfil };
      }

      // Para cualquier otro tipo de cuenta no definido
      return base;
    });

    // ✅ Devolver respuesta final
    return NextResponse.json({
      success: true,
      gestionusuario: usuariosFiltrados,
    });
  } catch (error) {
    console.error("Error al obtener lista de usuarios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
