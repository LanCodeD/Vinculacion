// src/app/api/Ofertas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { ROLE_MAP, AppRole } from "@/types/roles";

export async function POST(req: Request) {
  try {
    // Obtener sesión
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    // Validar rol usando ROLE_MAP
    const userRole: AppRole = ROLE_MAP[session.user.roles_id];
    if (userRole !== "Empresa") {
      return NextResponse.json(
        { ok: false, error: "Solo cuentas de empresa pueden crear ofertas" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validar campos obligatorios
    const requiredFields = [
      "titulo",
      "descripcion",
      "puesto",
      "ubicacion",
      "imagen",
      "fecha_cierre",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { ok: false, error: `Falta el campo obligatorio: ${field}` },
          { status: 400 }
        );
      }
    }

    // Buscar empresa asociada al usuario logeado
    const empresa = await prisma.empresas.findFirst({
      where: { usuarios_id: session.user.id },
    });

    if (!empresa) {
      return NextResponse.json(
        { ok: false, error: "No se encontró empresa asociada al usuario" },
        { status: 404 }
      );
    }

    const { titulo, descripcion, puesto, ubicacion, imagen, fecha_cierre } =
      body;

    // Crear la oferta
    const oferta = await prisma.ofertas.create({
      data: {
        titulo,
        descripcion,
        puesto,
        ubicacion,
        imagen,
        fecha_cierre: new Date(fecha_cierre),
        empresas_id: empresa.id_empresas,
        creado_por_usuarios_id: session.user.id,
        fecha_publicacion: new Date(),
        oferta_estados_id: 2, // pendiente de revisión
      },
    });

    // Notificar admins y subadmins
    const admins = await prisma.usuarios.findMany({
      where: { roles_id: { in: [4, 5] } }, // 4=Admin, 5=Subadmin
    });

    if (admins.length > 0) {
      await prisma.notificaciones.createMany({
        data: admins.map((a) => ({
          usuarios_id: a.id_usuarios,
          tipo: "nueva_vacante",
          titulo: "Nueva vacante pendiente de aprobación",
          mensaje: `La empresa "${empresa.nombre_comercial}" ha creado la vacante "${titulo}".`,
        })),
      });
    }

    return NextResponse.json({ ok: true, oferta });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error al crear la vacante" },
      { status: 500 }
    );
  }
}
