
import NewsArticleCollection from "@/components/news-article/NewsArticleCollection";
import { Metadata } from "next";


export const metadata: Metadata ={
    title: "Latest Crypto & Blockchain Articles | Blockchain Briefing",
    description: "Latest Crypto & Blockchain Articles",
    keywords:"crypto news, blockchain insights, bitcoin, ethereum, defi, web3"
}

export default function ArticlesPage() {
    return (
        <section className="min-h-screen">
            <NewsArticleCollection />
        </section>
    );
}
