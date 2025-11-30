// app/api/Usuarios/google-complete/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptionsCredencial";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

/**
 * Regex para correos institucionales
 */
const regexInstitucional =
  /^(?=(?:[A-Za-z0-9.#+-][A-Za-z]){2,})(?!.*[.#+-]{2,})(?!^[.#+-])(?!.*[.#+-]$)[A-Za-z0-9._#+-]+@valladolid\.tecnm\.mx$/;

/**
 * Mapeo tipoCuenta -> rol
 */
const rolPorTipoCuenta: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
};

/**
 * Tipado del body esperado
 */
interface BodyTipoCuenta {
  tipoCuentaId?: number;
  tipoCuenta?: number;
}

export async function POST(req: Request) {
  try {
    // 1) validar sesión
    const session: Session | null = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    /**
     * Tipamos userObj correctamente para evitar ANY
     */
    const userObj = session.user as Session["user"] & {
      correo?: string | null;
      idGoogle?: string | null;
      id?: string | number | null;
      image?: string | null;
    };

    // correo preferimos "correo", si no existe usamos "email"
    const correo = (userObj.correo ?? userObj.email)?.toString() ?? "";
    if (!correo) {
      return NextResponse.json(
        { error: "No se encontró correo en la sesión" },
        { status: 400 }
      );
    }

    // 2) leer body
    let body: BodyTipoCuenta;
    try {
      body = (await req.json()) as BodyTipoCuenta;
    } catch {
      return NextResponse.json({ error: "Body inválido" }, { status: 400 });
    }

    const tipoCuentaId = Number(body.tipoCuentaId ?? body.tipoCuenta ?? 0);
    if (!tipoCuentaId) {
      return NextResponse.json(
        { error: "Falta tipoCuentaId" },
        { status: 400 }
      );
    }

    // 3) validar dominio institucional
    if (tipoCuentaId === 1 && !regexInstitucional.test(correo)) {
      return NextResponse.json(
        { error: "El correo no cumple el dominio institucional" },
        { status: 400 }
      );
    }

    const rolId = rolPorTipoCuenta[tipoCuentaId];
    if (!rolId) {
      return NextResponse.json(
        { error: "Tipo de cuenta inválido" },
        { status: 400 }
      );
    }

    // 4) buscar usuario
    let usuario = await prisma.usuarios.findUnique({
      where: { correo },
    });

    // nombre y apellido
    const fullName = userObj.name?.toString() ?? "";
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    const nombre =
      parts.length > 0 ? parts.shift()! : userObj.name ?? "SinNombre";
    const apellido = parts.join(" ");

    // providerId idGoogle -> id -> email -> uuid
    const providerId =
      (userObj.idGoogle && String(userObj.idGoogle)) ||
      (userObj.id ? String(userObj.id) : null) ||
      userObj.email ||
      uuidv4();

    console.log("DEBUG userObj.idGoogle BEFORE SAVE:", userObj.idGoogle);
    console.log("DEBUG typeof idGoogle:", typeof userObj.idGoogle);

    // 5) crear o actualizar usuario
    if (!usuario) {
      const idAccount = uuidv4();

      usuario = await prisma.$transaction(async (tx) => {
        const nuevo = await tx.usuarios.create({
          data: {
            nombre,
            apellido,
            correo,
            tipos_cuenta_id: tipoCuentaId,
            roles_id: rolId,
            paso_actual: 4,
            correo_verificado: 1,
            correo_verificado_en: new Date(),
            foto_perfil: userObj.image ?? undefined,
          },
        });

        await tx.accounts.create({
          data: {
            id_accounts: idAccount,
            usuarios_id: nuevo.id_usuarios,
            provider: "google",
            providerAccountId: providerId,
          },
        });

        return nuevo;
      });
    } else {
      // actualizar
      await prisma.$transaction(async (tx) => {
        await tx.usuarios.update({
          where: { id_usuarios: usuario!.id_usuarios },
          data: {
            tipos_cuenta_id: tipoCuentaId,
            roles_id: rolId,
            paso_actual: Math.max(usuario!.paso_actual ?? 1, 4),
            actualizado_en: new Date(),
            ...(userObj.image && !usuario!.foto_perfil
              ? { foto_perfil: userObj.image }
              : {}),
          },
        });

        // buscar account con mismo providerId
        const existingAccount = await tx.accounts.findFirst({
          where: {
            usuarios_id: usuario!.id_usuarios,
            provider: "google",
            providerAccountId: providerId,
          },
        });

        if (!existingAccount) {
          // buscar legacy
          const legacy = await tx.accounts.findFirst({
            where: {
              usuarios_id: usuario!.id_usuarios,
              provider: "google",
              providerAccountId: { contains: "@" },
            },
          });

          if (legacy) {
            await tx.accounts.updateMany({
              where: {
                usuarios_id: usuario!.id_usuarios,
                provider: "google",
                providerAccountId: { contains: "@" },
              },
              data: { providerAccountId: providerId },
            });
          } else {
            await tx.accounts.create({
              data: {
                id_accounts: uuidv4(),
                usuarios_id: usuario!.id_usuarios,
                provider: "google",
                providerAccountId: providerId,
              },
            });
          }
        }
      });

      usuario = await prisma.usuarios.findUnique({ where: { correo } });
    }

    // 6) responder
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
