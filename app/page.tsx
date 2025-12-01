import Home from "@/components/ClientPages/Home/Home";
import { Metadata } from "next";
import SchemaOrg from "@/components/Schema";
import { liveUrl } from "@/lib/utils";
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from "firebase/firestore";

export const metadata: Metadata = {
  title: "Central Park News | Home",
  description: "Covering community events, local news, and stories in and around Central Park, NYC. Fresh coverage, updated daily.",
  keywords: "Central Park news, NYC park updates, New York local stories, Manhattan news",
  alternates: {
    canonical: `${liveUrl}`
  }
};

async function fetchFeaturedArticle() {
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
      mobileURL: data?.socialImageUrls?.mobile.url || '',
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
      "Stay updated with the latest headlines, breaking news, and community stories in Central Park , NY. Your trusted source for local updates.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` }
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article?.title || "Welcome To Central Park News",
    image: [article?.imageURL || article?.mobileURL || null],
    author: { "@type": "Person", name: article?.authorName || 'Newstrix' },
    datePublished: article?.createdAt || new Date().toISOString(),
    dateModified: article?.createdAt || new Date().toISOString(),
    mainEntityOfPage: `${siteUrl}/news/${article?.titleSlug}`
  };

  return <>
    <SchemaOrg schemas={[webPageSchema, articleSchema]} />
    <Home article={article} />
  </>
}

export const revalidate = 360; 
