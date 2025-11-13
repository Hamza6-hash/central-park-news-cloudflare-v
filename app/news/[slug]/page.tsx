import React from "react";
import NewsClient from "@/components/ClientPages/NewsSingle/NewsClient";
import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDocs, query, where, getDoc } from "firebase/firestore";
import { Metadata } from "next";
import SchemaOrg from "@/components/Schema";
import { News } from "@/components/ClientPages/NewsSingle/NewsClient";
import { getFiveRelatedNewsByCategory } from "@/lib/serverQuery";
import { redirect } from "next/navigation";
import { liveUrl } from "@/lib/utils";

export async function generateStaticParams() {
  const newsCollection = collection(db, "blog/centralparkNews/newsletter");
  const q = query(newsCollection, where("status", "==", "published"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    slug: doc.data().titleSlug,
  }));
}

async function getNewsData(slug: string) {
  try {
    if (!db) {
      return null;
    }
    const newsCollection = collection(db, "blog/centralparkNews/newsletter");
    const q = query(newsCollection, where("titleSlug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    const rawData = docSnap.data();

    const data = {
      ...rawData,
      citation: undefined,
    };

    let authorName = "Docket Digest News Room";
    let authorImage = "/default-avatar.png";
    let authorPosition = "N/A";

    // @ts-ignore
    if (data?.authorId) {
      try {
        // @ts-ignore
        const authorRef = doc(db, "blog/centralparkNews/authors", data.authorId);
        const authorDoc = await getDoc(authorRef);

        if (authorDoc.exists()) {
          const authorData = authorDoc.data();
          authorName = authorData.author_name || authorName;
          authorImage = authorData.imageURL || authorImage;
          authorPosition = authorData.position || authorPosition;
        }
      } catch (err) {
      }
    }
    
    return {
      ...data,
      id: docSnap.id,
      authorName,
      authorImage,
      authorPosition,
    } as unknown as News;
  } catch (error) {
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
        title: `Newsletter Not Found | Central Park News`,
        description: "The requested newsletter could not be found.",
      };
    }

    if (!newsData.title || !newsData.excerpt) {
      return {
        title: "Invalid Newsletter Data | Central Park News",
        description: "The requested newsletter has invalid data.",
      };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || liveUrl;

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
      title: `${newsData.title} | Central Park News`,
      description: newsData.excerpt,
      keywords: keywords,
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: newsData.title,
        description: newsData.excerpt,
        url: pageUrl,
        siteName: "Central Park News",
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
        authors: ["Central Park News"],
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
    return {
      title: "Error | Central Park News",
      description: "An error occurred while fetching the newsletter metadata.",
    };
  }
}

export default async function NewsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const newsData = await getNewsData(slug);

  if (!newsData) {
    redirect('/')
  }

  const relatedNews = await getFiveRelatedNewsByCategory(newsData.category, slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || liveUrl;
  const pageUrl = `${siteUrl}/news/${slug}`;

  // ----- JSON-LD Schemas -----
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: newsData.title,
    url: pageUrl,
    description: newsData.excerpt,
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${pageUrl}#article`,
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
    headline: newsData.title,
    image: newsData.socialImageUrls?.original?.url || newsData.imageURL,
    datePublished: newsData.publishDate,
    dateModified: newsData.updatedAt || newsData.publishDate,
    author: {
      "@type": "Person",
      name: newsData.authorName || "Central Park News Editorial"
    },
    publisher: { "@id": `${siteUrl}/#organization` },
    description: newsData.excerpt,
    articleBody: newsData.content,
    articleSection: newsData.category || "News",
    url: pageUrl
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
      <SchemaOrg schemas={[breadcrumbSchema, webPageSchema, newsArticleSchema]} />
      <div>
        <NewsClient slug={params.slug} data={newsData as News} relatedNews={relatedNews as News[]} />
      </div>
    </>
  );
}

export const revalidate = 300;