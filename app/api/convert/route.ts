import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: NextRequest) {
  try {
    const { html, format } = await request.json();

    if (!html || typeof html !== "string") {
      return NextResponse.json(
        { error: "HTML code is required" },
        { status: 400 }
      );
    }

    if (format !== "png" && format !== "jpg") {
      return NextResponse.json(
        { error: "Format must be 'png' or 'jpg'" },
        { status: 400 }
      );
    }

    // Launch Puppeteer browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });

    try {
      const page = await browser.newPage();

      // Set fixed viewport size: 1080 × 1350 px (4:5 aspect ratio, portrait)
      await page.setViewport({
        width: 1080,
        height: 1350,
        deviceScaleFactor: 2, // For higher quality images
      });

      // Set the HTML content
      await page.setContent(html, {
        waitUntil: "networkidle0", // Wait until all resources are loaded
      });

      // Wait a bit more to ensure all CSS animations/transitions are complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Convert "jpg" to "jpeg" for Puppeteer (it expects "jpeg")
      const screenshotType = format === "jpg" ? "jpeg" : format;

      // Take screenshot of the fixed viewport size (1080 × 1350)
      const screenshot = await page.screenshot({
        type: screenshotType as "png" | "jpeg",
        omitBackground: format === "png", // Transparent background for PNG
      });

      // Convert Buffer to Uint8Array for NextResponse compatibility
      const imageBuffer = new Uint8Array(screenshot);

      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          "Content-Type": format === "png" ? "image/png" : "image/jpeg",
          "Content-Disposition": `attachment; filename="converted-image.${format === "jpg" ? "jpg" : format}"`,
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during conversion",
      },
      { status: 500 }
    );
  }
}
