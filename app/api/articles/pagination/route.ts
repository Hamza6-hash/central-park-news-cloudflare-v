import { NextRequest, NextResponse } from "next/server";
import { getArticlesPaginated } from "@/lib/services";
import { defultImage } from "@/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "9", 10);
    const type = (searchParams.get("type") || "news") as "news" | "article";

    if (page < 1 || itemsPerPage < 1) {
      return NextResponse.json(
        { error: "Invalid page or itemsPerPage parameters" },
        { status: 400 }
      );
    }

    const result = await getArticlesPaginated(page, itemsPerPage, type);

    const itemsData = result.items.map((data) => ({
      ...data,
      imageURL: data.imageURL || defultImage,
    }));

    return NextResponse.json({
      ...result,
      items: itemsData,
    });
  } catch (error) {
    console.error("Error in pagination API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
