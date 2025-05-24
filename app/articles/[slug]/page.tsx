import React from "react";
import ArticleClient from "@/components/ArticleSingle/ArticleClient";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { generateSlug } from "@/lib/utils";


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

    const articlesCollection = collection(db, "blog/blockchainBriefing/articles");
    const q = query(articlesCollection, where("titleSlug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // console.warn(`No article found for slug: ${slug}`);
      return {
        title: "Article Not Found | Blockchain Briefing",
        description: "The requested article could not be found.",
      };
    }

    const articleData = querySnapshot.docs[0].data();

    if (!articleData || !articleData.title) {
      return {
        title: "Invalid Article Data | Blockchain Briefing",
        description: "The requested article has invalid data.",
      };
    }

    return {
      title: `${articleData.title} | Blockchain Briefing`,
      description:
        articleData.excerpt || "Read the latest articles on blockchain and cryptocurrency.",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error | Blockchain Briefing",
      description: "An error occurred while fetching the article metadata.",
    };
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <ArticleClient slug={params.slug} />
    </div>
  );
}
