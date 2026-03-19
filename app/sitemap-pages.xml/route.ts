// Serves static pages sitemap at /sitemap-pages.xml
import { NextResponse } from "next/server";
import { sitemapGenerator } from "@/lib/sitemap";

const CACHE_MAX_AGE = 900; // 15 min

export async function GET() {
  try {
    const xml = await sitemapGenerator.getPagesSitemap();
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}`,
      },
    });
  } catch (error) {
    console.error("Sitemap pages error:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
