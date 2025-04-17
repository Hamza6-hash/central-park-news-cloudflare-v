import React from "react";
import NewsArticleCollection from "@/components/news-article/NewsArticleCollection";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Latest Crypto & Blockchain News | Blockchain Briefing",
    description: "Explore the latest updates in cryptocurrency and blockchain technology. Get breaking news on Bitcoin, Ethereum, DeFi, NFTs, and Web3 — all in one place.",
    keywords: "latest crypto news, bitcoin news, ethereum updates, nft news, blockchain headlines, defi, web3, daily crypto updates"
}

export default function NewsPage() {
  return (
    <>
   
      <section className="min-h-screen">
        <NewsArticleCollection />
      </section>
    </>
  );
}
