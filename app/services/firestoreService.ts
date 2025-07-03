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
  categoryId?: string;
  featuredArticle?: boolean;
  tags?: string;
  titleSlug: string;
  type: 'article' | 'news';
}

interface Author {
  id: string;
  name: string;
  author_name: string;
}

interface Category {
  id: string;
  name: string;
}

export interface ArticleWithDetails extends Article {
  category: Category | null;
  author: Author | null;
  titleSlug: string;
  type: 'article' | 'news';
}


export const fireServices = {
  searchArticles: async (
    searchTerm: string,
    limitCount: number = 10
  ): Promise<ArticleWithDetails[]> => {
    try {
      const articlesRef = collection(db, "blog/blockchainBriefing/articles");
      const newsRef = collection(db, "blog/blockchainBriefing/newsletter");

      const articlesQuery = query(
        articlesRef,
        where("status", "==", "published") 
      );
      const newsQuery = query(
        newsRef,
        where("status", "==", "published")
      );
  
      const [articlesSnapshot, newsSnapshot] = await Promise.all([
        getDocs(articlesQuery),
        getDocs(newsQuery),
      ]);
  
      const allItems = [
        ...articlesSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          type: "article" as const,
        })),
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
          let category: Category | null = null;
          let author: Author | null = null;
  
          if (item.categoryId) {
            try {
              const categoryDoc = await getDoc(
                doc(db, "blog/blockchainBriefing/categories", item.categoryId)
              );
              if (categoryDoc.exists()) {
                category = {
                  id: categoryDoc.id,
                  ...categoryDoc.data(),
                } as Category;
              }
            } catch (categoryError) {
              console.error("Error fetching category:", categoryError);
            }
          }
  
          if (item.authorId) {
            try {
              const authorDoc = await getDoc(
                doc(db, "blog/blockchainBriefing/authors", item.authorId)
              );
              if (authorDoc.exists()) {
                author = {
                  id: authorDoc.id,
                  ...authorDoc.data(),
                } as Author;
              }
            } catch (authorError) {
              console.error("Error fetching author:", authorError);
            }
          }
  
          return {
            ...item,
            category,
            author,
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

