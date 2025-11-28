import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { renderReporteConveniosHTML } from "@/VinculacionReporte/Convenios/ReporteConveniosDoc";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const convenios = Array.isArray(body?.convenios) ? body.convenios : [];

    const html = renderReporteConveniosHTML(convenios);

    const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Reporte_Convenios</title>
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
    // Convertimos cualquier Uint8Array o SharedArrayBuffer a un Buffer de Node
    const nodeBuffer = Buffer.from(pdf);

    // Enviamos el PDF usando un Buffer de Node (Next.js lo acepta sin problemas)
    return new Response(nodeBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=reporte.pdf",
      },
    });
  } catch (e) {
    console.error(e);
    return new NextResponse("Error", { status: 500 });
  }
}
