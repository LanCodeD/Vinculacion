// src/app/api/VinculacionReporteContactos/route.ts
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { renderReporteContactosHTML } from "@/VinculacionReporte/Convenios/ReporteContactos";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const contactos = Array.isArray(body?.contactos) ? body.contactos : [];

    const html = renderReporteContactosHTML(contactos);

    const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Reporte_Contactos</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>${html}</body>
    </html>`;

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    return new Response(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=ReporteContactos.pdf",
      },
    });
  } catch (e) {
    console.error(e);
    return new NextResponse("Error", { status: 500 });
  }
}
