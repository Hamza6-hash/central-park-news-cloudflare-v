import React from "react";
import NewsClient from "@/components/NewsSingle/NewsClient";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    if (!db) {
      console.error("Firestore is not initialized.");
      return {
        title: "Error | Blockchain Briefing",
        description: "An error occurred while fetching the article metadata.",
      };
    }

    const newsCollection = collection(db, "blog/blockchainBriefing/newsletter");
    const q = query(newsCollection, where("titleSlug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // console.warn(`No article found for slug: ${slug}`);
      return {
        title: `${slug}| Blockchain Briefing`,
        description: "The requested article could not be found.",
      };
    }

    const newsData = querySnapshot.docs[0].data();

    if (!newsData || !newsData.title) {
      return {
        title: "Invalid Article Data | Blockchain Briefing",
        description: "The requested article has invalid data.",
      };
    }

    return {
      title: `${newsData.title} | Blockchain Briefing`,
      description:
        newsData.excerpt || "Read the latest articles on blockchain and cryptocurrency.",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error | Blockchain Briefing",
      description: "An error occurred while fetching the article metadata.",
    };
  }
}

export default function NewsPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <NewsClient slug={params.slug} />
    </div>
  );
}