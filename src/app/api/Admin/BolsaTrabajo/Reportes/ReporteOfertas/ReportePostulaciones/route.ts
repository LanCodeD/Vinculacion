import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { renderReportePostulacionesHTML } from "@/BolsaReporte/postulaciones"; // tu plantilla HTML

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const reporte = body?.reporte;

    if (!reporte || !Array.isArray(reporte.postulaciones)) {
      return new NextResponse("No hay datos para generar el PDF", { status: 400 });
    }

    const html = renderReportePostulacionesHTML(reporte);

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Reporte_Postulaciones</title>
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
        "Content-Disposition": "attachment; filename=reporte_postulaciones.pdf",
      },
    });
  } catch (e) {
    console.error("❌ Error generando PDF Reporte Postulaciones:", e);
    return new NextResponse("Error generando PDF", { status: 500 });
  }
}
