import NewsArticleCollection from "@/components/news-article/NewsArticleCollection";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Blockchain Briefing | News",
  description: "Explore the latest updates in cryptocurrency and blockchain technology and stay ahead with Blockchain Briefing — your source for real-time crypto news, blockchain trends, and market insights. Get breaking news on Bitcoin, Ethereum, DeFi, NFTs, DAOs, RAWs, and Web3 — all in one place.",
  keywords: "latest crypto news, bitcoin news, ethereum updates, nft news, blockchain headlines, defi, web3, daily crypto updates, crypto news, blockchain news, cryptocurrency updates, bitcoin news, ethereum news, decentralized finance news, crypto trends, blockchain technology, web3 updates, NFTs news, decentralized autonomous organizations, tokenization & real-world assets, defi news, DAOs, RAWs"
}

export default function NewsPage() {
  return (
    <>
      <NewsArticleCollection />
    </>
  );
}
