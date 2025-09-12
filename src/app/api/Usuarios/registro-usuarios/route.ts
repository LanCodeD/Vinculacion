import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { enviarCorreo } from "@/lib/mailer"; // 👈 usamos helper con OAuth2

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
    const body = await req.json();
    const { tipoCuentaId, datosBasicos } = body;

    if (!tipoCuentaId || !datosBasicos) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const { nombre, apellido, correo, password, celular } = datosBasicos;

    // Validación: campos requeridos
    if (!nombre || !apellido || !correo || !password) {
      return NextResponse.json(
        { error: "Nombre, apellido, correo y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // Validación: correo único
    const usuarioExistente = await prisma.usuarios.findUnique({
      where: { correo },
    });
    if (usuarioExistente) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 409 }
      );
    }

    // Validación: correo institucional (solo docentes)
    if (tipoCuentaId === 1 && !regexInstitucional.test(correo)) {
      return NextResponse.json(
        {
          error:
            "El correo debe ser institucional Docente (Dominio del plantel)",
        },
        { status: 400 }
      );
    }

    // Validación: contraseña mínima
    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    // Rol correspondiente
    const rolId = rolPorTipoCuenta[tipoCuentaId];
    if (!rolId) {
      return NextResponse.json(
        { error: "Tipo de cuenta no válido" },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        tipos_cuenta_id: tipoCuentaId,
        roles_id: rolId,
        nombre,
        apellido,
        correo,
        password_hash: hashedPassword,
        celular,
      },
    });

    // 1️⃣ Generar token de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // 2️⃣ Hashear token (SHA256 en vez de bcrypt, más ligero)
    const tokenHash = crypto.createHash("sha256").update(codigo).digest("hex");

    // 3️⃣ Expiración (15 min, UTC-06:00)
    const ahora = new Date();
    const expiracion = new Date(ahora.getTime() + 15 * 60 * 1000);

    // 4️⃣ Guardar token en DB
    await prisma.tokens_usuarios.create({
      data: {
        usuarios_id: nuevoUsuario.id_usuarios,
        token_hash: tokenHash,
        tipo: "verificacion",
        expiracion_en: expiracion,
      },
    });

    // 5️⃣ Enviar correo con helper OAuth2
    await enviarCorreo({
      to: correo,
      subject: "Código de verificación",
      html: `
        <h2>Bienvenido, ${nombre}!</h2>
        <p>Tu código de verificación es:</p>
        <h1 style="font-size:32px; letter-spacing:8px;">${codigo}</h1>
        <p>Este código expirará en 15 minutos.</p>
        <br>
        <small>Zona horaria: UTC-06:00 (México)</small>
      `,
    });

    // Respuesta limpia
    return NextResponse.json(
      {
        message: "Usuario creado y token enviado con éxito",
        id_usuarios: nuevoUsuario.id_usuarios,
        tipoCuentaId: nuevoUsuario.tipos_cuenta_id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error en POST /api/usuarios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
