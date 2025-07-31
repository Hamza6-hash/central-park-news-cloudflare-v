import { fetchCombinedFeaturedItem } from "@/lib/query";
import Home from "@/components/Home/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Central Park News | Home",
  description: "Covering community events, local news, and stories in and around Central Park, NYC. Fresh coverage, updated daily.",
  keywords: "Central Park news, NYC park updates, New York local stories, Manhattan news"
};


export default async function HomePage() {
  const article = await fetchCombinedFeaturedItem();
  return <Home article={article} />

}

export const revalidate = 360; 
