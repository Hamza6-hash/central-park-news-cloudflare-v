import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/lib/services";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("q");
    const limitCount = parseInt(searchParams.get("limit") || "20", 10);

    if (!searchTerm || searchTerm.trim() === "") {
      return NextResponse.json({ results: [] });
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    const finalResults = await searchArticles(searchTerm, limitCount);

    return NextResponse.json({
      results: finalResults,
      total: finalResults.length,
      searchTerm: normalizedSearchTerm,
      totalFound: finalResults.length,
    });
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json(
      { error: "Internal server error", results: [] },
      { status: 500 }
    );
  }
}
