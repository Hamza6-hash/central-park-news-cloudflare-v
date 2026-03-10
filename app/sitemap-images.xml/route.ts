import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  DocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import { liveUrl } from "@/lib/utils";

const NEWS_COLLECTION = "blog/centralparkNews/newsletter";
const BATCH_SIZE = 500; // Firestore batch fetch size

interface ImageItem {
  url: string;
  title: string;
}

async function getAllArticleImages(): Promise<ImageItem[]> {
  if (!db) return [];

  const images: ImageItem[] = [];
  let lastDoc: DocumentSnapshot | null = null;

  try {
    // Fetch all published articles in batches
    let hasMore = true;

    while (hasMore) {
      let q = query(
        collection(db, NEWS_COLLECTION),
        where("status", "==", "published"),
        orderBy("createdAt", "desc"),
        limit(BATCH_SIZE)
      );

      if (lastDoc) {
        q = query(
          collection(db, NEWS_COLLECTION),
          where("status", "==", "published"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(BATCH_SIZE)
        );
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        hasMore = false;
        break;
      }

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        // Main article image
        if (data.imageURL) {
          images.push({
            url: data.imageURL,
            title: data.title || "Article image",
          });
        }

        // Mobile/social images if available
        if (data.socialImageUrls?.mobile?.url) {
          images.push({
            url: data.socialImageUrls.mobile.url,
            title: `${data.title || "Article"} - Mobile version`,
          });
        }

        if (data.socialImageUrls?.facebook?.url) {
          images.push({
            url: data.socialImageUrls.facebook.url,
            title: `${data.title || "Article"} - Social version`,
          });
        }

        if (data.socialImageUrls?.twitter?.url) {
          images.push({
            url: data.socialImageUrls.twitter.url,
            title: `${data.title || "Article"} - Twitter version`,
          });
        }
      });

      lastDoc = snapshot.docs[snapshot.docs.length - 1];
    }
  } catch (error) {
    console.error("Error fetching article images:", error);
  }

  return images;
}

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

    // Deduplicate URLs
    const uniqueImages = Array.from(
      new Map(images.map((img) => [img.url, img])).values()
    );

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
