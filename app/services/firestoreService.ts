import { db } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface Article {
  id: string;
  title: string;
  content: string;
  imageURL?: string | StaticImport;
  authorId: string;
  authorName?: string;
  publishDate: {
    seconds: number;
    nanoseconds: number;
  };
  date?: {
    seconds: number;
    nanoseconds: number;
  };
  formattedDate?: string;
  featuredArticle?: boolean;
  tags?: string;
  titleSlug: string;
  type: "article" | "news";
}

interface Author {
  id: string;
  name: string;
  author_name: string;
}


export interface ArticleWithDetails extends Article {
  author: Author | null;
  category: string;
  titleSlug: string;
  type: "article" | "news";
}

export const fireServices = {
  searchArticles: async (
    searchTerm: string,
    limitCount: number = 10
  ): Promise<ArticleWithDetails[]> => {
    try {
      const newsRef = collection(db, "blog/centralparkNews/newsletter");
      const newsQuery = query(newsRef, where("status", "==", "published"));
      const newsSnapshot = await getDocs(newsQuery)
      
      const allItems = [
        ...newsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          type: "news" as const,
        })),
      ] as (Article & { type: "article" | "news" })[];

      const matchingItems = allItems.filter((item) => {
        const title = item.title?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();
        return title.includes(search);
      });

      const itemsWithDetails = await Promise.all(
        matchingItems.map(async (item) => {
          return {
            ...item,
            titleSlug: item.titleSlug,
            type: item.type,
          } as ArticleWithDetails;
        })
      );

      return itemsWithDetails.slice(0, limitCount);
    } catch (error) {
      console.error("Error in searchArticles:", error);
      throw error;
    }
  },
};
