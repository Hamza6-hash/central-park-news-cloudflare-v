import { NextRequest, NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/services";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const type = (request.nextUrl.searchParams.get("type") || "news") as "news" | "article";

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const item = await getArticleBySlug(slug, type);
    if (!item) {
      return NextResponse.json(null, { status: 404 });
    }

    const formattedDate = item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown Date";

    const result = {
      ...item,
      id: item.id,
      authorName: item.authorName || "Unknown Author",
      position: item.authorPosition || "Unknown Position",
      authorImage: item.authorImage || "/default-avatar.png",
      formattedDate,
      createdAt: formattedDate,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
