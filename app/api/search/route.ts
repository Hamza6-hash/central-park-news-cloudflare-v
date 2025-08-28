import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
} from "firebase/firestore";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  authorName: string;
  createdAt: string;
  titleSlug: string;
  type: string;
  category_name?: string;
}

interface ScoredItem extends SearchResult {
  relevanceScore: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("q");
    const limitCount = parseInt(searchParams.get("limit") || "20", 20);

    if (!searchTerm || searchTerm.trim() === "") {
      return NextResponse.json({ results: [] });
    }

    // Normalize search term for case-insensitive matching
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    const searchWords = normalizedSearchTerm
      .split(" ")
      .filter((word) => word.length > 0);

    // Search only in newsletter collection
    const collections = ["blog/centralparkNews/newsletter"];

    const allResults: ScoredItem[] = [];
    const maxItemsPerCollection = Math.ceil(limitCount * 2); // Get more items to filter from

    for (const collectionPath of collections) {
      try {
        const itemsRef = collection(db, collectionPath);

        // Use simple queries that don't require complex indexes
        const queries = [];

        // Query 1: Get recent published items (this should work with existing indexes)
        queries.push(
          query(
            itemsRef,
            where("status", "==", "published"),
            orderBy("createdAt", "desc"),
            limit(maxItemsPerCollection)
          )
        );

        // Query 2: Get featured items if they exist
        queries.push(
          query(
            itemsRef,
            where("status", "==", "published"),
            orderBy("createdAt", "desc"),
            limit(Math.ceil(maxItemsPerCollection / 2))
          )
        );

        // Execute queries and collect unique results
        const uniqueItems = new Map<string, any>();

        for (const q of queries) {
          try {
            const snapshot = await getDocs(q);

            snapshot.docs.forEach((doc) => {
              if (!uniqueItems.has(doc.id)) {
                uniqueItems.set(doc.id, { id: doc.id, data: doc.data() });
              }
            });
          } catch (error) {
            console.warn(
              `Query failed for collection ${collectionPath}:`,
              error
            );
            // Continue with other queries
          }
        }

        // Process collected items
        if (uniqueItems.size > 0) {
          const items = Array.from(uniqueItems.values());

          // Get all author IDs for batch fetching
          const authorIds = new Set<string>();
          items.forEach(({ data }) => {
            if (data.authorId) authorIds.add(data.authorId);
          });

          // Batch fetch authors
          const authorsMap = new Map<string, any>();
          if (authorIds.size > 0) {
            try {
              const authorsRef = collection(
                db,
                "blog/centralparkNews/authors"
              );
              const authorQuery = query(
                authorsRef,
                where("__name__", "in", Array.from(authorIds))
              );
              const authorSnapshot = await getDocs(authorQuery);

              authorSnapshot.docs.forEach((doc) => {
                authorsMap.set(doc.id, doc.data());
              });
            } catch (error) {
              console.error("Error fetching authors in batch:", error);
            }
          }

          // Enhanced filtering with better relevance scoring
          const processedItems = items
            .map(({ id, data }) => {
              const title = data.title || "";
              const content = data.content || "";

              // Calculate relevance score
              let relevanceScore = 0;
              let hasMatch = false;

              // Title matching (highest priority)
              if (title.toLowerCase().includes(normalizedSearchTerm)) {
                relevanceScore += 100;
                hasMatch = true;
              }

              // Content matching
              if (content.toLowerCase().includes(normalizedSearchTerm)) {
                relevanceScore += 50;
                hasMatch = true;
              }

              // Partial word matching
              searchWords.forEach((word) => {
                if (word.length >= 3) {
                  if (title.toLowerCase().includes(word)) {
                    relevanceScore += 30;
                    hasMatch = true;
                  }
                  if (content.toLowerCase().includes(word)) {
                    relevanceScore += 15;
                    hasMatch = true;
                  }
                }
              });

              // Featured bonus
              if (data.isFeatured) {
                relevanceScore += 20;
              }

              // Recency bonus
              try {
                const date = new Date(data.createdAt);
                const daysOld =
                  (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
                if (daysOld < 7) relevanceScore += 10;
                else if (daysOld < 30) relevanceScore += 5;
              } catch (e) {
                // Ignore date parsing errors
              }

              if (!hasMatch) {
                return null;
              }

              const authorName =
                data.authorId && authorsMap.has(data.authorId)
                  ? authorsMap.get(data.authorId).author_name
                  : "Docket Digest News Room";

              return {
                id,
                title: data.title || "",
                content: data.content || "",
                imageURL: data.imageURL || "",
                authorName,
                createdAt: data.createdAt || "",
                titleSlug: data.titleSlug || "",
                type: collectionPath.includes("newsletter")
                  ? "news"
                  : "article",
                category_name:
                  data.category || data.category_name || "Local News",
                relevanceScore,
              } as ScoredItem;
            })
            .filter(Boolean) as ScoredItem[];

          allResults.push(...processedItems);
        }
      } catch (error) {
        console.error(`Error searching collection ${collectionPath}:`, error);
      }
    }

    // Sort by relevance score, then by date
    const sortedResults = allResults
      .sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .map(({ relevanceScore, ...result }) => result);

    // Limit results and return
    const finalResults = sortedResults.slice(0, limitCount);

    return NextResponse.json({
      results: finalResults,
      total: finalResults.length,
      searchTerm: normalizedSearchTerm,
      totalFound: allResults.length,
    });
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json(
      { error: "Internal server error", results: [] },
      { status: 500 }
    );
  }
}
