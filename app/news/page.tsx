import NewsArticleCollection from "@/components/ClientPages/news-article/NewsArticleCollection";
import { Metadata } from "next";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "News | Central Parks News - Central Park, NYC",
  description: "Follow up-to-date news, stories, and developments from Central Park and nearby New York areas.",
  keywords: "Central Park NYC news, local updates, Manhattan current events"
}

export default function NewsPage() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <NewsArticleCollection />
      </Suspense>
    </>
  );
}
