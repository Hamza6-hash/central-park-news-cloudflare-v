import Home from "@/components/ClientPages/Home/Home";
import { Metadata } from "next";
import SchemaOrg from "@/components/Schema";
import { liveUrl } from "@/lib/utils";
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from "firebase/firestore";
import { unstable_cache } from "next/cache";

export async function generateMetadata(): Promise<Metadata> {
  const article = await fetchFeaturedArticle();
  const siteUrl = liveUrl;
  const title = "Central Park News | Home";
  const description = "Covering community events, local news, and stories in and around Central Park, NYC. Fresh coverage, updated daily.";
  const ogImage = article?.mobileURL || article?.imageURL || `${siteUrl}/og-image.jpg`;

  return {
    title,
    description,
    keywords: ["Central Park news", "NYC park updates", "New York local stories", "Manhattan news"],
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: "Central Park News",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article?.title || "Central Park News",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
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
}

// Internal function that performs the actual fetch
async function _fetchFeaturedArticle() {
  try {
    if (!db) {
      return null;
    }

    const newsPath = 'blog/centralparkNews/newsletter';
    const newsRef = collection(db, newsPath);

    const newsQuery = query(
      newsRef,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const newsSnap = await getDocs(newsQuery);

    if (newsSnap.empty) {
      return null;
    }

    const docSnapshot = newsSnap.docs[0];
    const data = docSnapshot.data();
    let authorName = 'Docket Digest News Room';

    if (data.authorId) {
      try {
        const authorRef = doc(
          db,
          'blog/centralparkNews/authors',
          data.authorId
        );
        const authorSnap = await getDoc(authorRef);
        if (authorSnap.exists()) {
          const authorData = authorSnap.data();
          authorName = authorData.author_name;
        }
      } catch (error) {
        console.error('Error fetching author:', error);
      }
    }

    return {
      id: docSnapshot.id,
      title: data.title || '',
      content: data.content || '',
      category: data.category || 'N/A',
      imageURL: data.imageURL,
      authorId: data.authorId || '',
      authorName,
      mobileURL: data?.socialImageUrls?.mobile?.url || '',
      titleSlug: data.titleSlug || '',
      type: 'newsletter',
      createdAt: data.createdAt,
      isFeatured: data.isFeatured || false,
      publishDate: {
        seconds: data.date?.seconds || new Date().getTime() / 1000,
        nanoseconds: data.date?.nanoseconds || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching featured article:', error);
    return null;
  }
}

// Cached function - not exported to avoid Next.js build errors
// Page files can only export specific Next.js exports (default, metadata, generateMetadata, etc.)
const fetchFeaturedArticle = unstable_cache(
  _fetchFeaturedArticle,
  ['featured-article'],
  { revalidate: 360 }
);

export default async function HomePage() {
  const article = await fetchFeaturedArticle();
  const siteUrl = liveUrl;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#home`,
    name: "Central Park News | Home",
    url: siteUrl,
    description:
      "Stay updated with the latest headlines, breaking news, and community stories in Central Park, NY. Your trusted source for local updates.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-US",
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
      ],
    },
  };

  return (
    <>
      <SchemaOrg schemas={[webPageSchema]} />
      <Home article={article} />
    </>
  );
}

export const revalidate = 360; 
