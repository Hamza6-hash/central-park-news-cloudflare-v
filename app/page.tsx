import { fetchCombinedFeaturedItem } from "@/lib/query";
import Home from "@/components/Home/Home";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blockchain Briefing | Home",
  description: "Stay ahead with Blockchain Briefing — your source for real-time crypto news, blockchain trends, and market insights.",
  keywords: 'crypto news, blockchain news, cryptocurrency updates, bitcoin news, ethereum news, decentralized finance news, crypto trends, blockchain technology, web3 updates, NFTs news, decentralized autonomous organizations, tokenization & real-world assets, defi news, DAOs, RAWs'
};

export default async function HomePage() {
  const article = await fetchCombinedFeaturedItem();
  return <>
    <Suspense fallback={<div>Loading home...</div>}>
      <Home article={article} />
    </Suspense>
  </>

}

export const revalidate = 60; 
