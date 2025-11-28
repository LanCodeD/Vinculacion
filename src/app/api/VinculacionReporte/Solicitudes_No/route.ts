import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { renderReporteSolicitudesHTML } from "@/VinculacionReporte/Convenios/ReporteSolicitudesNo";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const solicitudes = Array.isArray(body?.solicitudes)
      ? body.solicitudes
      : [];

    const html = renderReporteSolicitudesHTML(solicitudes);

    const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Reporte_Solicitudes_No_Concluidas</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>${html}</body>
    </html>`;

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

    const nodeBuffer = Buffer.from(pdf);

    return new Response(nodeBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=reporte_solicitudes.pdf",
      },
    });
  } catch (e) {
    console.error(e);
    return new NextResponse("Error", { status: 500 });
  }
}
