import { NextResponse } from "next/server";
import { getAllArticleImages } from "@/lib/services";

export const runtime = "edge";

function escapeXmlInUrl(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const images = await getAllArticleImages();

    if (images.length === 0) {
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
</urlset>`,
        {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=900",
          },
        }
      );
    }

    const uniqueImages = Array.from(new Map(images.map((img) => [img.url, img])).values());

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${uniqueImages
  .map(
    (img) => `  <url>
    <loc>${escapeXmlInUrl(img.url)}</loc>
    <image:image>
      <image:loc>${escapeXmlInUrl(img.url)}</image:loc>
      <image:title>${escapeXmlInUrl(img.title)}</image:title>
      <image:caption>Image from Central Park News</image:caption>
    </image:image>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=900",
      },
    });
  } catch (error) {
    console.error("Image sitemap error:", error);
    return new NextResponse("Error generating image sitemap", { status: 500 });
  }
}
