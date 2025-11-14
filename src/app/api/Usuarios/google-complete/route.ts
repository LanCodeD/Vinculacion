// app/api/Usuarios/google-complete/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"; // ajusta si lo moviste
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

// Regex institucional (docente)
const regexInstitucional =
  /^(?=(?:[A-Za-z0-9.#+-][A-Za-z]){2,})(?!.*[.#+-]{2,})(?!^[.#+-])(?!.*[.#+-]$)[A-Za-z0-9._#+-]+@valladolid\.tecnm\.mx$/;

// Mapeo tipoCuenta → rol
const rolPorTipoCuenta: Record<number, number> = {
  1: 1, // Docente
  2: 2, // Egresado
  3: 3, // Empresa
};

export async function POST(req: Request) {
  try {
    // 1) validar sesión (NextAuth)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const correo = session.user.email;

    // 2) leer body: tipoCuenta (preferible enviar en body JSON desde el cliente)
    const body = await req.json();
    const tipoCuentaId = Number(body?.tipoCuentaId ?? body?.tipoCuenta ?? 0);
    if (!tipoCuentaId) {
      return NextResponse.json({ error: "Falta tipoCuentaId" }, { status: 400 });
    }

    // 3) validación de dominio si es docente (1)
    if (tipoCuentaId === 1 && !regexInstitucional.test(correo)) {
      return NextResponse.json(
        { error: "El correo no cumple el dominio institucional" },
        { status: 400 }
      );
    }

    const rolId = rolPorTipoCuenta[tipoCuentaId];
    if (!rolId) {
      return NextResponse.json({ error: "Tipo de cuenta inválido" }, { status: 400 });
    }

    // 4) buscar usuario existente por correo
    let usuario = await prisma.usuarios.findUnique({ where: { correo } });

    // Extraer nombre/apellido desde session.user.name si existe
    const fullName = session.user.name ?? "";
    const nameParts = fullName.trim().split(/\s+/);
    const nombre = nameParts.shift() ?? session.user.name ?? "SinNombre";
    const apellido = nameParts.join(" ") ?? "";

    // 5) Si no existe: crearlo con mínimos datos (sin password)
    // Si existe: actualizar tipos_cuenta_id / roles_id si hace falta
    if (!usuario) {
      // crear dentro de transacción para también crear accounts
      const idAccount = uuidv4();

      const created = await prisma.$transaction(async (tx) => {
        const nuevo = await tx.usuarios.create({
          data: {
            nombre,
            apellido,
            correo,
            tipos_cuenta_id: tipoCuentaId,
            roles_id: rolId,
            paso_actual: 4, // ya salta a perfil
            correo_verificado: 1,
            correo_verificado_en: new Date(),
            // foto_perfil: session.user.image ?? undefined
            foto_perfil: session.user.image ?? undefined,
          },
        });

        await tx.accounts.create({
          data: {
            id_accounts: idAccount,
            usuarios_id: nuevo.id_usuarios,
            provider: "google",
            providerAccountId: session.user?.email ?? idAccount, // puedes usar profile id si lo pasas
          },
        });

        return nuevo;
      });

      usuario = created;
    } else {
      // usuario ya existe → actualizar role/tipo y crear account si no existe para Google
      await prisma.$transaction(async (tx) => {
        // actualizar tipo/rol si difieren
        await tx.usuarios.update({
          where: { id_usuarios: usuario!.id_usuarios },
          data: {
            tipos_cuenta_id: tipoCuentaId,
            roles_id: rolId,
            paso_actual: Math.max(usuario!.paso_actual ?? 1, 4),
            actualizado_en: new Date(),
            // actualizar foto si no existe
            ...(session.user.image && !usuario!.foto_perfil
              ? { foto_perfil: session.user.image }
              : {}),
          },
        });

        // crear account si no existe
        const existingAccount = await tx.accounts.findFirst({
          where: {
            usuarios_id: usuario!.id_usuarios,
            provider: "google",
          },
        });

        if (!existingAccount) {
          await tx.accounts.create({
            data: {
              id_accounts: uuidv4(),
              usuarios_id: usuario!.id_usuarios,
              provider: "google",
              providerAccountId: session.user?.email ?? uuidv4(),
            },
          });
        }
      });

      // recarga usuario para devolver datos actualizados
      usuario = await prisma.usuarios.findUnique({ where: { correo } });
    }

    // 6) responder con id de usuario y mensaje
    return NextResponse.json(
      {
        message: "Usuario creado/actualizado con Google",
        id_usuarios: usuario?.id_usuarios,
        tipoCuentaId: usuario?.tipos_cuenta_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERROR /api/Usuarios/google-complete", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
