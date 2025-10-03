import { fetchCombinedFeaturedItem } from "@/lib/query";
import Home from "@/components/ClientPages/Home/Home";
import { Metadata } from "next";
import SchemaOrg from "@/components/Schema";

export const metadata: Metadata = {
  title: "Central Park News | Home",
  description: "Covering community events, local news, and stories in and around Central Park, NYC. Fresh coverage, updated daily.",
  keywords: "Central Park news, NYC park updates, New York local stories, Manhattan news"
};

export default async function HomePage() {
  const article = await fetchCombinedFeaturedItem();
  const siteUrl = "https://central-park-news.vercel.app/";

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#webpage`,
    name: "Cenral Park News | Home",
    url: siteUrl,
    description:
      "Stay updated with the latest headlines, breaking news, and community stories in Central Park , NY. Your trusted source for local updates.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` }
  };


  return <>
    <SchemaOrg schemas={[webPageSchema]} />
    <Home article={article} />
  </>
}

export const revalidate = 360; 
