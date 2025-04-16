import React from "react";
import ArticleClient from "@/components/ArticleSingle/ArticleClient";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { generateSlug } from "@/lib/utils"; // Utility function to generate slugs

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

    const baseSlug = slug.replace(/-\d+$/, ""); 
    const requestedNumber = slug.match(/-(\d+)$/)?.[1]; 
    const articlesCollection = collection(db, "blog/blockchainBriefing/articles");
    const querySnapshot = await getDocs(articlesCollection);

    const matchingDocs = querySnapshot.docs.filter((doc) => {
      const titleSlug = doc.data().titleSlug;

      if (!titleSlug) {
        console.warn(`Document missing titleSlug: ${doc.id}`);
        return false; 
      }

      return titleSlug.startsWith(baseSlug);
    });

    if (matchingDocs.length === 0) {
      console.warn(`No article found for slug: ${slug}`);
      return {
        title: "Article Not Found | Blockchain Briefing",
        description: "The requested article could not be found.",
      };
    }

    matchingDocs.sort((a, b) => a.data().titleSlug.localeCompare(b.data().titleSlug));

    let matchingDoc;
    if (requestedNumber) {
      const index = parseInt(requestedNumber, 10) - 1;
      if (index >= 0 && index < matchingDocs.length) {
        matchingDoc = matchingDocs[index];
      } else {
        // console.warn(`Article number out of range for slug: ${slug}`);
        return {
          title: "Article Not Found | Blockchain Briefing",
          description: "The requested article could not be found.",
        };
      }
    } else {
      matchingDoc = matchingDocs[0];
    }

    const articleData = matchingDoc.data();
    if (!articleData || !articleData.title) {
      // console.warn(`Invalid data for slug: ${slug}`);
      return {
        title: "Invalid Article Data | Blockchain Briefing",
        description: "The requested article has invalid data.",
      };
    }

    if (!articleData.titleSlug) {
      const generatedSlug = generateSlug(articleData.title, matchingDoc.id); 
      const articleRef = doc(db, "blog/blockchainBriefing/articles", matchingDoc.id);
      await updateDoc(articleRef, { titleSlug: generatedSlug });
      // console.log(`Generated and saved titleSlug: ${generatedSlug}`);
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
