import React from "react";
export const runtime = "edge";
import NewsClient from "@/components/ClientPages/NewsSingle/NewsClient";
import { Metadata } from "next";
import SchemaOrg from "@/components/Schema";
import { News } from "@/components/ClientPages/NewsSingle/NewsClient";
import { getArticleBySlug, getRelatedArticles } from "@/lib/services";
import { notFound } from "next/navigation";
import { formatDateToISO, liveUrl, calculateReadingTime, extractFaqsFromMarkdown } from "@/lib/utils";
import { stripMarkdown } from "@/lib/query";
import GoogleNewsSubscription from "@/components/Scripts/GoogleNewsSubscription";
import { unstable_cache } from "next/cache";

async function _getNewsData(slug: string) {
  return getArticleBySlug(slug, "news");
}

const getNewsData = unstable_cache(
  (slug: string) => _getNewsData(slug),
  ["news-article"],
  { revalidate: 300 }
);

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const newsData = await getNewsData(slug);

  if (!newsData) {
    return {
      title: `Newsletter Not Found | Central Park News`,
      description: "The requested newsletter could not be found.",
      robots: { index: false, follow: false },
    };
  }

  if (!newsData.title || !newsData.excerpt) {
    return {
      title: "Invalid Newsletter Data | Central Park News",
      description: "The requested newsletter has invalid data.",
      robots: { index: false, follow: false },
    };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || liveUrl).replace(/\/$/, "");
  const pageUrl = `${siteUrl}/news/${slug}`;

  const ogImageUrl =
    (newsData as any).socialImageUrls?.mobile?.url ||
    (newsData as any).socialImageUrls?.facebook?.url ||
    newsData.imageURL;
  const twitterImageUrl =
    (newsData as any).socialImageUrls?.twitter?.url ||
    (newsData as any).socialImageUrls?.facebook?.url ||
    newsData.imageURL;

  const publishedTime = formatDateToISO(newsData.publishDate || newsData.date || newsData.createdAt);
  const modifiedTime = formatDateToISO((newsData as any).updatedAt || newsData.publishDate || newsData.date || newsData.createdAt);

  const plainContent = stripMarkdown(newsData.content || "");
  const readingTimeMinutes = calculateReadingTime(plainContent);

  const keywords = Array.isArray(newsData.tags) ? [...newsData.tags] : [];
  if (newsData.category) keywords.push(newsData.category);
  keywords.push("Central Park News", "NYC News", "Manhattan News");

  return {
    title: `${newsData.title} | Central Park News`,
    description: newsData.excerpt,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: newsData.title,
      description: newsData.excerpt,
      url: pageUrl,
      siteName: "Central Park News",
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630, alt: newsData.title }] : [],
      locale: "en_US",
      type: "article",
      publishedTime,
      modifiedTime,
      authors: [newsData.authorName || "Sarah Lee"],
      section: newsData.category || "News",
      tags: Array.isArray(newsData.tags) ? newsData.tags : [],
    },
    twitter: {
      card: "summary_large_image",
      title: newsData.title,
      description: newsData.excerpt,
      images: twitterImageUrl ? [twitterImageUrl] : [],
      creator: "@centralparknews",
      site: "@centralparknews",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
    other: { "article:reading_time": `${readingTimeMinutes}` },
  };
}

export default async function NewsPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const newsData = await getNewsData(slug);

  if (!newsData) notFound();

  const relatedNews = await getRelatedArticles(newsData.category || "", slug, 6);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || liveUrl).replace(/\/$/, "");
  const pageUrl = `${siteUrl}/news/${slug}`;

  const publishedDate = formatDateToISO(newsData.publishDate || newsData.date || newsData.createdAt);
  const modifiedDate = formatDateToISO((newsData as any).updatedAt || newsData.publishDate || newsData.date || newsData.createdAt);

  const articleImages = [];
  const social = (newsData as any).socialImageUrls;
  if (social?.original?.url) articleImages.push(social.original.url);
  if (social?.facebook?.url && !articleImages.includes(social.facebook.url)) articleImages.push(social.facebook.url);
  if (newsData.imageURL && !articleImages.includes(newsData.imageURL)) articleImages.push(newsData.imageURL);
  if (articleImages.length === 0) articleImages.push(`${siteUrl}/main.webp`);

  const faqs = extractFaqsFromMarkdown(newsData.content || "");
  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }
      : null;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: newsData.title,
    url: pageUrl,
    description: newsData.excerpt,
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-US",
    datePublished: publishedDate,
    dateModified: modifiedDate,
  };

  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${pageUrl}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${pageUrl}#webpage` },
    headline: newsData.title,
    image: articleImages.length === 1 ? articleImages[0] : articleImages,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Person",
      "@id": `${siteUrl}/author/sarah-lee#author`,
      name: "Sarah Lee",
      jobTitle: "Staff Reporter",
      url: `${siteUrl}/author/sarah-lee`,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      "@id": `${siteUrl}/#organization`,
      name: "Central Park News",
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png`, width: 600, height: 60 },
    },
    isPartOf: { "@type": "Product", productID: "CAowjsrDDA:openaccess" },
    isAccessibleForFree: true,
    description: newsData.excerpt,
    articleBody: stripMarkdown(newsData.content || ""),
    articleSection: newsData.category || "News",
    keywords: Array.isArray(newsData.tags) ? newsData.tags.join(", ") : "",
    wordCount: stripMarkdown(newsData.content || "").split(/\s+/).length,
    inLanguage: "en-US",
    url: pageUrl,
    about: { "@type": "Thing", name: newsData.category || "News" },
    mentions: Array.isArray(newsData.tags) ? newsData.tags.map((tag) => ({ "@type": "Thing", name: tag })) : [],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1.font-century-schoolbook", "p.markdown-p"],
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "News", item: `${siteUrl}/news` },
      { "@type": "ListItem", position: 3, name: newsData.title, item: pageUrl },
    ],
  };

  return (
    <>
      <SchemaOrg
        schemas={[
          breadcrumbSchema,
          webPageSchema,
          newsArticleSchema,
          ...(faqSchema ? [faqSchema] : []),
        ]}
      />
      <GoogleNewsSubscription slug={slug} />
      <div>
        <NewsClient slug={slug} data={newsData as News} relatedNews={relatedNews as News[]} />
      </div>
    </>
  );
}

export const revalidate = 300;
