import React from "react";
import NewsClient from "@/components/NewsSingle/NewsClient";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Metadata } from "next";
import SchemaOrg from "@/components/Schema";
import { News } from "@/components/NewsSingle/NewsClient";

async function getNewsData(slug: string) {
  try {
    if (!db) {
      console.error("Firestore is not initialized.");
      return null;
    }

    const newsCollection = collection(db, "blog/blockchainBriefing/newsletter");
    const q = query(newsCollection, where("titleSlug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`No article found for slug: ${slug}`);
      return null;
    }

    return querySnapshot.docs[0].data();
  } catch (error) {
    console.error(`Error fetching article data for slug ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  try {
    const newsData = await getNewsData(slug);

    if (!newsData) {
      return {
        title: `Newsletter Not Found | Blockchain Briefing`,
        description: "The requested newsletter could not be found.",
      };
    }

    if (!newsData.title || !newsData.excerpt) {
      return {
        title: "Invalid Newsletter Data | Blockchain Briefing",
        description: "The requested newsletter has invalid data.",
      };
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.blockchainbriefing.com";
    const pageUrl = `${siteUrl}/news/${slug}`;
    const ogImageUrl =
      newsData.socialImageUrls?.facebook?.url || newsData.imageURL;
    const twitterImageUrl =
      newsData.socialImageUrls?.twitter?.url || newsData.imageURL;

    const keywords = newsData.tags;
    if (newsData.category) {
      keywords.push(newsData.category);
    }

    return {
      title: `${newsData.title} | Blockchain Briefing`,
      description: newsData.excerpt,
      keywords: keywords,
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: newsData.title,
        description: newsData.excerpt,
        url: pageUrl,
        siteName: "Blockchain Briefing",
        images: ogImageUrl
          ? [
              {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: newsData.title,
              },
            ]
          : [],
        locale: "en_US",
        type: "article",
        publishedTime: newsData.publishDate,
        modifiedTime: newsData.updatedAt,
        authors: ["Blockchain Briefing"],
        section: newsData.category,
        tags: newsData.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: newsData.title,
        description: newsData.excerpt,
        images: twitterImageUrl ? [twitterImageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error | Blockchain Briefing",
      description: "An error occurred while fetching the newsletter metadata.",
    };
  }
}

export default async function NewsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const newsData = await getNewsData(slug);

  if (!newsData) {
    return <div>Newsletter not found.</div>;
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.blockchainbriefing.com";
  const pageUrl = `${siteUrl}/news/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    headline: newsData.title,
    image: newsData.socialImageUrls?.original?.url || newsData.imageURL,
    datePublished: newsData.publishDate,
    dateModified: newsData.updatedAt,
    author: {
      "@type": "Organization",
      name: "Blockchain Briefing",
    },
    publisher: {
      "@type": "Organization",
      name: "Blockchain Briefing",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    description: newsData.excerpt,
    articleBody: newsData.content,
  };

  return (
    <>
      <SchemaOrg schemas={[jsonLd]} />
      <div>
        <NewsClient slug={params.slug} data={newsData as News} />
      </div>
    </>
  );
}