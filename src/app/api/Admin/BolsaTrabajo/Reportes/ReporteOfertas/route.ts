import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { renderReporteOfertasHTML } from "@/BolsaReporte/ofertas";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ofertas = Array.isArray(body?.ofertas) ? body.ofertas : [];

    const html = renderReporteOfertasHTML(ofertas);

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Reporte_Ofertas</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>${html}</body>
      </html>
    `;

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      printBackground: true,
      width: "10in",
      height: "13in",
    });

    await browser.close();

    const buffer = Buffer.from(pdf);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=reporte_ofertas.pdf",
      },
    });
  } catch (e) {
    console.error("❌ Error generando PDF Reporte Ofertas:", e);
    return new NextResponse("Error", { status: 500 });
  }
}
