import { NextResponse } from "next/server";
import { sitemapGenerator } from "@/lib/sitemap";

const CACHE_MAX_AGE = 900; 

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;
    const chunkNum = parseInt(page ?? "0", 10);
    if (isNaN(chunkNum) || chunkNum < 1) {
      return new NextResponse("Invalid sitemap page", { status: 400 });
    }
    const xml = await sitemapGenerator.getPostsSitemap(chunkNum);
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}`,
      },
    });
  } catch (error) {
    console.error("Sitemap posts error:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
