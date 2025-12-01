import NewsArticleCollection from "@/components/ClientPages/news-article/NewsArticleCollection";
import CardSkeleton from "@/components/Loadings/CardSkeleton";
import SchemaOrg from "@/components/Schema";
import { stripMarkdown } from "@/lib/query";
import { liveUrl } from "@/lib/utils";
import { Metadata } from "next";
import { Suspense } from "react";

const ITEMS_PER_PAGE = 9;

interface Article {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  isFeatured?: boolean;
  authorName: string;
  createdAt: string;
  titleSlug: string;
  type: string;
  category_name?: string;
}

interface PaginationData {
  items: Article[];
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentPage: number;
}

export const metadata: Metadata = {
  title: "News | Central Parks News - Central Park, NYC",
  description: "Follow up-to-date news, stories, and developments from Central Park and nearby New York areas.",
  keywords: [
    "Central Park NYC news",
    "local updates",
    "Manhattan current events",
    "Central Park community stories",
    "NYC breaking news"
  ],
  alternates: {
    canonical: `${liveUrl}/news`
  }
}

async function getInitialNewsData(): Promise<PaginationData> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || liveUrl}/api/articles/pagination?page=1&itemsPerPage=${ITEMS_PER_PAGE}&type=news`,
      {
        next: { revalidate: 3600 }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching initial news data:', error);
    // Return empty data if fetch fails
    return {
      items: [],
      totalPages: 0,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
      currentPage: 1
    };
  }
}

export default async function NewsPage() {
  const siteUrl = liveUrl;
  const initialData = await getInitialNewsData();

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/news#collectionpage`,
    name: "Latest Central Park News & Local Stories",
    url: `${siteUrl}/news`,
    description:
      "Read the latest news articles, breaking stories, and local updates from Central Park and surrounding New York neighborhoods.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` },
    "mainEntity": {
      "@type": "ItemList",
      "@id": `${siteUrl}/news#itemlist`
    },
    mainContentOfPage: {
      "@type": "ItemList",
      numberOfItems: initialData.totalItems,
      itemListElement: initialData.items.map((article, index) => ({
        "@type": "NewsArticle",
        position: index + 1,
        headline: article.title,
        description: stripMarkdown(article.content).substring(0, 160),
        image: article.imageURL || `${siteUrl}/main.webp`,
        datePublished: article.createdAt,
        author: {
          "@type": "Person",
          name: article.authorName,
        },
        url: `${siteUrl}/news/${article.titleSlug}`,
      })),
    }
  };

  return (
    <>
      <SchemaOrg schemas={[collectionPageSchema]} />
      <Suspense fallback={<CardSkeleton ITEMS_PER_PAGE={9} />}>
        <NewsArticleCollection initialData={initialData} />
      </Suspense>
    </>
  );
}