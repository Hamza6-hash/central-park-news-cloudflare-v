import { NextRequest, NextResponse } from "next/server";
import { getLatestArticles } from "@/lib/services";

export async function GET(request: NextRequest) {
  try {
    const limitCount = parseInt(request.nextUrl.searchParams.get("limit") || "12", 10);
    const articlesData = await getLatestArticles(limitCount, "news");
    return NextResponse.json(articlesData);
  } catch (error) {
    console.error("Error fetching latest news:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
