import React from "react";
import NewsClient from "@/components/NewsSingle/NewsClient";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    if (!db) {
      console.error("Firestore is not initialized.");
      return {
        title: "Error | Blockchain Briefing",
        description: "An error occurred while fetching the news metadata.",
      };
    }

    const baseSlug = slug.replace(/-\d+$/, ""); 
    const requestedNumber = slug.match(/-(\d+)$/)?.[1]; 


    const newsletterCollection = collection(db, "blog/blockchainBriefing/newsletter");
    const querySnapshot = await getDocs(newsletterCollection);

    const matchingDocs = querySnapshot.docs.filter((doc) =>
      doc.data().titleSlug.startsWith(baseSlug)
    );

    if (matchingDocs.length === 0) {
      console.warn(`No news found for slug: ${slug}`);
      return {
        title: "News Not Found | Blockchain Briefing",
        description: "The requested news article could not be found.",
      };
    }

    matchingDocs.sort((a, b) => a.data().titleSlug.localeCompare(b.data().titleSlug));

   
    let matchingDoc;
    if (requestedNumber) {
      const index = parseInt(requestedNumber, 10) - 1; 
      if (index >= 0 && index < matchingDocs.length) {
        matchingDoc = matchingDocs[index];
      } else {
        console.warn(`News number out of range for slug: ${slug}`);
        return {
          title: "News Not Found | Blockchain Briefing",
          description: "The requested news article could not be found.",
        };
      }
    } else {

      matchingDoc = matchingDocs[0];
    }

    const newsData = matchingDoc.data();
    if (!newsData || !newsData.title) {
      console.warn(`Invalid data for slug: ${slug}`);
      return {
        title: "Invalid News Data | Blockchain Briefing",
        description: "The requested news article has invalid data.",
      };
    }

    return {
      title: `${newsData.title} | Blockchain Briefing`,
      description:
        newsData.excerpt || "Read the latest news on blockchain and cryptocurrency.",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error | Blockchain Briefing",
      description: "An error occurred while fetching the news metadata.",
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