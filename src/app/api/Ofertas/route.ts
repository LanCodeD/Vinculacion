// src/app/api/Ofertas/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { ROLE_MAP, AppRole } from "@/types/roles";
import { enviarCorreo } from "@/lib/mailer";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    console.log("[GET] Usuario logueado:", session.user.nombre);
    console.log("[GET] Rol:", session.user.role);
    console.log("[GET] roles_id:", session.user.roles_id);
    console.log("[GET] ID usuario:", session.user.id);

    // Buscar la empresa asociada al usuario
    const empresa = await prisma.empresas.findFirst({
      where: { usuarios_id: session.user.id },
    });

    if (!empresa) {
      return NextResponse.json(
        { ok: false, error: "Empresa no encontrada" },
        { status: 404 }
      );
    }

    // Obtener las vacantes creadas por esta empresa
    const vacantes = await prisma.ofertas.findMany({
      where: { empresas_id: empresa.id_empresas },
      select: {
        id_ofertas: true,
        titulo: true,
        puesto: true,
        descripcion: true,
        imagen: true,
        oferta_estados_id: true,
        fecha_publicacion: true,
      },
      orderBy: { fecha_publicacion: "desc" },
    });

    return NextResponse.json({ ok: true, vacantes });
  } catch (error) {
    console.error("Error en GET /api/Ofertas:", error);
    return NextResponse.json(
      { ok: false, error: "Error al obtener vacantes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    // Mostrar información de depuración
    console.log("[POST] Usuario logueado:", session.user.nombre);
    console.log("[POST] Rol:", session.user.role);
    console.log("[POST] roles_id:", session.user.roles_id);
    console.log("[POST] ID usuario:", session.user.id);

    // Validar rol usando ROLE_MAP
    const userRole: AppRole = ROLE_MAP[session.user.roles_id];
    if (userRole !== "Empresa") {
      console.log("Rol no autorizado para crear ofertas:", userRole);
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

    // Buscar empresa asociada al usuario logueado
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
        oferta_estados_id: 2, // Pendiente de revisión
      },
    });

    const { ingenierias } = body; // array de IDs
    if (ingenierias && ingenierias.length > 0) {
      await prisma.ofertas_ingenierias.createMany({
        data: ingenierias.map((ingId: number) => ({
          ofertas_id: oferta.id_ofertas,
          academias_id: ingId
        })),
      });
    }


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
      // Enviar correos a admins
      for (const admin of admins) {
        if (admin.correo) {
          enviarCorreo({
            to: admin.correo,
            subject: "Nueva vacante pendiente de aprobación",
            html: `<p>Hola ${admin.nombre},</p>
                   <p>La empresa "<strong>${empresa.nombre_comercial}</strong>" ha creado la vacante "<strong>${titulo}</strong>".</p>
                   <p>Por favor, revisa y aprueba o rechaza la vacante en el panel de administración.</p>
          
                   <p>Saludos,<br/>Equipo de Vinculación</p>`,
          }).catch((err) =>
            console.error("Error al enviar correo al admin:", err)
          );
          console.log("Correo enviado a admin:", admin.correo);
        }
      }
    }

    console.log("Vacante creada correctamente:", oferta.titulo);

    return NextResponse.json({ ok: true, oferta });
  } catch (error) {
    console.error("Error en POST /api/Ofertas:", error);
    return NextResponse.json(
      { ok: false, error: "Error al crear la vacante" },
      { status: 500 }
    );
  }
}
