import Home from "@/components/ClientPages/Home/Home";
import { Metadata } from "next";
import SchemaOrg from "@/components/Schema";
import { liveUrl } from "@/lib/utils";
import { getTopStories } from "@/lib/services";
import { unstable_cache } from "next/cache";
export const runtime = "edge";

const fetchTopStories = unstable_cache(
  () => getTopStories(7),
  ["top-stories"],
  { revalidate: 360 }
);

export async function generateMetadata(): Promise<Metadata> {
  const topStories = await fetchTopStories();
  const article = topStories?.[0] ?? null;
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

export default async function HomePage() {
  const topStories = await fetchTopStories();
  const article = topStories?.[0] ?? null;
  const siteUrl = liveUrl;
  const SITE_LAUNCH_DATE = "2025-01-01T00:00:00Z";

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
    datePublished: SITE_LAUNCH_DATE,
    dateModified: article?.createdAt || new Date().toISOString(),
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
      <Home article={article} topStories={topStories ?? []} />
    </>
  );
}

export const revalidate = 360;
