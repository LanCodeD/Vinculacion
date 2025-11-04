import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { enviarCorreo } from "@/lib/mailer";
import { Prisma } from "@prisma/client";




// Regex institucional (solo docentes)
const regexInstitucional =
  /^(?=(?:[A-Za-z0-9.#+-][A-Za-z]){2,})(?!.*[.#+-]{2,})(?!^[.#+-])(?!.*[.#+-]$)[A-Za-z0-9._#+-]+@valladolid\.tecnm\.mx$/;

// Mapeo tipoCuenta → rol
const rolPorTipoCuenta: Record<number, number> = {
  1: 1, // Docente
  2: 2, // Egresado
  3: 3, // Empresa
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ usuarioID: string }> }
) {
  const { usuarioID } = await params;
  const id = parseInt(usuarioID, 10);
  console.log("🪵 usuarioID recibido:", usuarioID, "->", id);

  try {
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No se enviaron datos" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuarios: id },
    });
    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const updates: Prisma.usuariosUpdateInput = {};

    if (body.nombre) updates.nombre = body.nombre;
    if (body.apellido) updates.apellido = body.apellido;

    if (body.correo && body.correo !== usuario.correo) {
      const existente = await prisma.usuarios.findUnique({
        where: { correo: body.correo },
      });
      if (existente) {
        return NextResponse.json(
          { error: "El correo ya está registrado" },
          { status: 409 }
        );
      }

      if (
        usuario.tipos_cuenta_id === 1 &&
        !regexInstitucional.test(body.correo)
      ) {
        return NextResponse.json(
          {
            error:
              "El correo debe ser institucional Docente (Dominio del plantel)",
          },
          { status: 400 }
        );
      }

      updates.correo = body.correo;

      const codigo = Math.floor(100000 + Math.random() * 900000).toString();
      const tokenHash = crypto
        .createHash("sha256")
        .update(codigo)
        .digest("hex");
      const expiracion = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.tokens_usuarios.create({
        data: {
          usuarios_id: id,
          token_hash: tokenHash,
          tipo: "verificacion",
          expiracion_en: expiracion,
        },
      });

      await enviarCorreo({
        to: body.correo,
        subject: "Código de verificación",
        html: `
          <h2>Hola ${usuario.nombre}!</h2>
          <p>Ingresa este código para continuar tu registro:</p>
          <h1 style="font-size:32px; letter-spacing:8px;">${codigo}</h1>
          <p>Expira en 10 minutos.</p>
          <br>
          <small>Si no solicitaste este token, ignora este mensaje.</small>
        `,
      });
    }

    if (body.password) {
      if (body.password.length < 8) {
        return NextResponse.json(
          { error: "La contraseña debe tener al menos 8 caracteres" },
          { status: 400 }
        );
      }

      if (!usuario.password_hash) {
        updates.password_hash = await bcrypt.hash(body.password, 10);
      } else {
        const esIgual = await bcrypt.compare(
          body.password,
          usuario.password_hash
        );
        if (!esIgual) {
          updates.password_hash = await bcrypt.hash(body.password, 10);
        }
      }
    }

    if (body.celular) updates.celular = body.celular;

    const rolId = rolPorTipoCuenta[usuario.tipos_cuenta_id];
    if (!rolId) {
      return NextResponse.json(
        { error: "Tipo de cuenta no válido" },
        { status: 400 }
      );
    }
    updates.roles = { connect: { id_roles: rolId } };

    const usuarioActualizado = await prisma.usuarios.update({
      where: { id_usuarios: id },
      data: updates,
    });

    return NextResponse.json(usuarioActualizado, { status: 200 });
  } catch (error) {
    console.error("❌ Error en PATCH usuario:", error);
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}
