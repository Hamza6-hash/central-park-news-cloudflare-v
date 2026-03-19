// Serves sitemap index at /sitemap.xml (lists sitemap-pages.xml + sitemap-posts/1, 2, ...)
import { NextResponse } from "next/server";
import { sitemapGenerator } from "@/lib/sitemap";

const CACHE_MAX_AGE = 900; // 15 min — faster discovery of new content

export async function GET() {
  try {
    const xml = await sitemapGenerator.getSitemapIndex();
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}`,
      },
    });
  } catch (error) {
    console.error("Sitemap index error:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
