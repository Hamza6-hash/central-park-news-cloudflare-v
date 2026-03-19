import { NextResponse } from "next/server";
import { getLatestArticles } from "@/lib/services";

const SITE_URL = "https://www.centralpark.news";
const FEED_TITLE = "Central Park News";
const FEED_DESCRIPTION =
  "Latest news and updates from Central Park News - Your source for Central Park and Upper Manhattan community news";
const GOOGLE_HUB = "https://pubsubhubbub.appspot.com/";

export const revalidate = 300;

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtmlAndMarkdown(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6}\s*/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function getArticleDate(article: any): Date {
  if (article.date) return new Date(article.date);
  if (article.publishDate) return new Date(article.publishDate);
  if (article.createdAt) return new Date(article.createdAt);
  return new Date();
}

function truncateDescription(text: string, maxLength = 300): string {
  const cleaned = stripHtmlAndMarkdown(text);
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength).trim() + "...";
}

export async function GET() {
  try {
    const articles = await getLatestArticles(50, "news");

    const lastBuildDate =
      articles.length > 0
        ? getArticleDate(articles[0]).toUTCString()
        : new Date().toUTCString();

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <atom:link href="${GOOGLE_HUB}" rel="hub"/>
    ${articles
      .map((article) => {
        const articleUrl = `${SITE_URL}/news/${article.titleSlug}`;
        const pubDate = getArticleDate(article).toUTCString();
        const description = truncateDescription(article.content || "");

        return `
    <item>
      <title>${escapeXml(article.title || "")}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
      ${article.category ? `<category>${escapeXml(article.category)}</category>` : ""}
      ${article.authorName ? `<author>${escapeXml(article.authorName)}</author>` : ""}
      ${article.imageURL ? `<media:content url="${escapeXml(article.imageURL)}" medium="image"/>` : ""}
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    const errorRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <atom:link href="${GOOGLE_HUB}" rel="hub"/>
  </channel>
</rss>`;

    return new NextResponse(errorRss, {
      status: 500,
      headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
  }
}
