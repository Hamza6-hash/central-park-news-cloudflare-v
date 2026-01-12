import React from "react";
import NewsClient from "@/components/ClientPages/NewsSingle/NewsClient";
import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDocs, query, where, getDoc } from "firebase/firestore";
import { Metadata } from "next";
import SchemaOrg from "@/components/Schema";
import { News } from "@/components/ClientPages/NewsSingle/NewsClient";
import { getFiveRelatedNewsByCategory } from "@/lib/serverQuery";
import { redirect } from "next/navigation";
import { formatDateToISO, liveUrl } from "@/lib/utils";
import { stripMarkdown } from "@/lib/query";
import GoogleNewsSubscription from "@/components/Scripts/GoogleNewsSubscription";
import { unstable_cache } from "next/cache";


// Internal function that performs the actual fetch
async function _getNewsData(slug: string) {
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

const getNewsData = unstable_cache(
  _getNewsData,
  ['news-article'],
  { revalidate: 300 }
);


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
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    if (!newsData.title || !newsData.excerpt) {
      return {
        title: "Invalid Newsletter Data | Central Park News",
        description: "The requested newsletter has invalid data.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || liveUrl;
    const pageUrl = `${siteUrl}/news/${slug}`;

    // Prefer mobile/portrait images for better Google Discover performance
    const ogImageUrl =
      newsData.socialImageUrls?.mobile?.url ||
      newsData.socialImageUrls?.facebook?.url ||
      newsData.imageURL;
    const twitterImageUrl =
      newsData.socialImageUrls?.twitter?.url ||
      newsData.socialImageUrls?.facebook?.url ||
      newsData.imageURL;

    // Format dates to ISO strings
    const publishedTime = formatDateToISO(newsData.publishDate || newsData.date || newsData.createdAt);
    const modifiedTime = formatDateToISO(newsData.updatedAt || newsData.publishDate || newsData.date || newsData.createdAt);

    const keywords = Array.isArray(newsData.tags) ? [...newsData.tags] : [];
    if (newsData.category) {
      keywords.push(newsData.category);
    }
    keywords.push("Central Park News", "NYC News", "Manhattan News");

    return {
      title: `${newsData.title} | Central Park News`,
      description: newsData.excerpt,
      keywords: keywords.length > 0 ? keywords : undefined,
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
        publishedTime: publishedTime,
        modifiedTime: modifiedTime,
        authors: [newsData.authorName || "Central Park News"],
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
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    return {
      title: "Error | Central Park News",
      description: "An error occurred while fetching the newsletter metadata.",
      robots: {
        index: false,
        follow: false,
      },
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

  // Format dates to ISO strings for schema.org
  const publishedDate = formatDateToISO(newsData.publishDate || newsData.date || newsData.createdAt);
  const modifiedDate = formatDateToISO(newsData.updatedAt || newsData.publishDate || newsData.date || newsData.createdAt);

  // Get article images - ensure it's an array
  const articleImages = [];
  if (newsData.socialImageUrls?.original?.url) {
    articleImages.push(newsData.socialImageUrls.original.url);
  }
  if (newsData.socialImageUrls?.facebook?.url && !articleImages.includes(newsData.socialImageUrls.facebook.url)) {
    articleImages.push(newsData.socialImageUrls.facebook.url);
  }
  if (newsData.imageURL && !articleImages.includes(newsData.imageURL)) {
    articleImages.push(newsData.imageURL);
  }
  // Fallback if no images
  if (articleImages.length === 0) {
    articleImages.push(`${siteUrl}/main.webp`);
  }

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
    inLanguage: "en-US",
    datePublished: publishedDate,
    dateModified: modifiedDate,
  };

  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${pageUrl}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`
    },
    headline: newsData.title,
    image: articleImages.length === 1 ? articleImages[0] : articleImages,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Person",
      name: newsData.authorName || "Central Park News",
      ...((newsData as any).authorImage && (newsData as any).authorImage !== "/default-avatar.png" && {
        image: (newsData as any).authorImage
      })
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Central Park News",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo`
      }
    },
    description: newsData.excerpt,
    articleBody: stripMarkdown(newsData.content || "").substring(0, 5000),
    articleSection: newsData.category || "News",
    url: pageUrl,
    ...(Array.isArray(newsData.tags) && newsData.tags.length > 0 && {
      keywords: newsData.tags.join(", ")
    }),
    wordCount: stripMarkdown(newsData.content || "").split(/\s+/).length,
    inLanguage: "en-US",
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
      <GoogleNewsSubscription slug={slug} />
      <div>
        <NewsClient slug={params.slug} data={newsData as News} relatedNews={relatedNews as News[]} />
      </div>
    </>
  );
}

export const revalidate = 300;