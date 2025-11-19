import NewsArticleCollection from "@/components/ClientPages/news-article/NewsArticleCollection";
import CardSkeleton from "@/components/Loadings/CardSkeleton";
import SchemaOrg from "@/components/Schema";
import { liveUrl } from "@/lib/utils";
import { Metadata } from "next";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "News | Central Parks News - Central Park, NYC",
  description: "Follow up-to-date news, stories, and developments from Central Park and nearby New York areas.",
  keywords: "Central Park NYC news, local updates, Manhattan current events"
}

export default function NewsPage() {
  const siteUrl = liveUrl;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/news#webpage`,
    name: "Latest News | Central Park News - Central Park, NY",
    url: `${siteUrl}/news`,
    description:
      "Read the latest news articles, breaking stories, and local updates from Central Park  and surrounding New York neighborhoods.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` }
  };

  return (
    <>
      <SchemaOrg schemas={[webPageSchema]} />
      <Suspense fallback={<CardSkeleton ITEMS_PER_PAGE={9} />}>
        <NewsArticleCollection />
      </Suspense>
    </>
  );
}