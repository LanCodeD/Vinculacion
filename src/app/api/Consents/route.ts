// app/api/consent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, avisoVersion, consentItems } = body;

    // Obtener IP de forma segura
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || '';

    const consent = await prisma.consents.create({
      data: {
        usuarios_id: userId,
        aviso_version: avisoVersion,
        ip,
        user_agent: userAgent,
        consent_items: consentItems || {},
      },
    });

    return NextResponse.json(consent, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error guardando el consentimiento' }, { status: 500 });
  }
}
