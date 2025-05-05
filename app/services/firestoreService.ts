import { db } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  limit,
  doc,
  getDoc,
  WhereFilterOp,
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

// Global variables
const DOCKET_DIGEST = "docketDigest";
const ARTICLES = "articles";
const CATEGORIES = "categories";
const AUTHORS = "authors";
const ARTICLES_ORDER_BY_FIELD = "publishDate";
const AUTHORS_ORDER_BY_FIELD = "author_name";
const CATEGORIES_ORDER_BY_FIELD = "name";

export const fireServices = {
  getDocuments: async (
    collectionPath: string[],
    orderByField: string,
    limitCount: number = 10,
    whereClause?: [string, WhereFilterOp, any]
  ): Promise<any[]> => {
    try {
      const collectionRef = collection(
        db,
        collectionPath[0],
        ...collectionPath.slice(1)
      );
      const q = query(
        collectionRef,
        orderBy(orderByField, "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error(
        `Error fetching documents from ${collectionPath.join("/")}:`,
        error
      );
      throw error;
    }
  },

  getArticles: async (
    limitCount: number = 10
  ): Promise<ArticleWithDetails[]> => {
    try {
      const articles = (await fireServices.getDocuments(
        ["blog", DOCKET_DIGEST, ARTICLES],
        ARTICLES_ORDER_BY_FIELD,
        limitCount,
        ["featuredArticle", "==", true] // Pass the where clause as an array
      )) as Article[];

      const articlesWithDetails = await Promise.all(
        articles.map(async (article) => {
          let category = null;
          let author = null;

          if (article.categoryId) {
            try {
              const categoryDoc = await getDoc(
                doc(db, "blog", DOCKET_DIGEST, CATEGORIES, article.categoryId)
              );
              if (categoryDoc.exists()) {
                category = {
                  id: categoryDoc.id,
                  ...categoryDoc.data(),
                } as Category;
              }
            } catch (categoryError) {
              console.error(
                "Error fetching category for article:",
                article,
                categoryError
              );
            }
          }

          if (article.authorId) {
            try {
              const authorDoc = await getDoc(
                doc(db, "blog", DOCKET_DIGEST, AUTHORS, article.authorId)
              );
              if (authorDoc.exists()) {
                author = { id: authorDoc.id, ...authorDoc.data() } as Author;
              }
            } catch (authorError) {
              console.error(
                "Error fetching author for article:",
                article,
                authorError
              );
            }
          }

          return {
            ...article,
            category,
            author,
          };
        })
      );

      return articlesWithDetails;
    } catch (error) {
      console.error("Error in getArticles:", error);
      throw error;
    }
  },

  // New function to get articles with an offset
  getArticlesWithOffset: async (
    removeCount: number = 10,
    limitCount: number = 10
  ): Promise<ArticleWithDetails[]> => {
    try {
      const articles = (await fireServices.getDocuments(
        ["blog", DOCKET_DIGEST, ARTICLES],
        ARTICLES_ORDER_BY_FIELD,
        limitCount + removeCount, // Fetch more articles to account for the offset
        ["featuredArticle", "==", true]
      )) as Article[];

      // Remove the specified number of articles from the beginning
      const articlesWithDetails = await Promise.all(
        articles.slice(removeCount).map(async (article) => {
          let category = null;
          let author = null;

          if (article.categoryId) {
            try {
              const categoryDoc = await getDoc(
                doc(db, "blog", DOCKET_DIGEST, CATEGORIES, article.categoryId)
              );
              if (categoryDoc.exists()) {
                category = {
                  id: categoryDoc.id,
                  ...categoryDoc.data(),
                } as Category;
              }
            } catch (categoryError) {
              console.error(
                "Error fetching category for article:",
                article,
                categoryError
              );
            }
          }

          if (article.authorId) {
            try {
              const authorDoc = await getDoc(
                doc(db, "blog", DOCKET_DIGEST, AUTHORS, article.authorId)
              );
              if (authorDoc.exists()) {
                author = { id: authorDoc.id, ...authorDoc.data() } as Author;
              }
            } catch (authorError) {
              console.error(
                "Error fetching author for article:",
                article,
                authorError
              );
            }
          }

          return {
            ...article,
            category,
            author,
          };
        })
      );

      return articlesWithDetails;
    } catch (error) {
      console.error("Error in getArticlesWithOffset:", error);
      throw error;
    }
  },

  getArticleById: async (id: string): Promise<ArticleWithDetails | null> => {
    try {
      const articleDoc = await getDoc(doc(db, "blog", DOCKET_DIGEST, ARTICLES, id));
      if (articleDoc.exists()) {
        const article = { id: articleDoc.id, ...articleDoc.data() } as ArticleWithDetails;

        // Fetch category and author details
        let category = null;
        let author = null;

        if (article.categoryId) {
          try {
            const categoryDoc = await getDoc(
              doc(db, "blog", DOCKET_DIGEST, CATEGORIES, article.categoryId)
            );
            if (categoryDoc.exists()) {
              category = {
                id: categoryDoc.id,
                ...categoryDoc.data(),
              } as Category;
            }
          } catch (categoryError) {
            console.error(
              "Error fetching category for article:",
              article,
              categoryError
            );
          }
        }

        if (article.authorId) {
          try {
            const authorDoc = await getDoc(
              doc(db, "blog", DOCKET_DIGEST, AUTHORS, article.authorId)
            );
            if (authorDoc.exists()) {
              author = { id: authorDoc.id, ...authorDoc.data() } as Author;
            }
          } catch (authorError) {
            console.error(
              "Error fetching author for article:",
              article,
              authorError
            );
          }
        }

        return {
          ...article,
          category,
          author,
        };
      }
      return null; // Return null if the article does not exist
    } catch (error) {
      console.error("Error fetching article by ID:", error);
      throw error;
    }
  },

  addArticle: async (article: Omit<Article, "id">): Promise<string> => {
    try {
      const articlesRef = collection(db, "blog", DOCKET_DIGEST, ARTICLES);
      
      // Generate base slug from title
      const baseSlug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Check for existing articles with the same base slug
      const q = query(articlesRef, where("titleSlug", ">=", baseSlug), where("titleSlug", "<=", baseSlug + "\uf8ff"));
      const existingArticles = await getDocs(q);
      
      let finalSlug = baseSlug;
      if (!existingArticles.empty) {
        // If there are existing articles with the same base slug, append a number
        const matchingArticles = existingArticles.docs.map(doc => doc.data().titleSlug);
        const numbers = matchingArticles
          .map(slug => parseInt(slug.match(/-(\d+)$/)?.[1] || '0'))
          .filter(num => !isNaN(num));
        
        const maxNumber = Math.max(0, ...numbers);
        finalSlug = `${baseSlug}-${maxNumber + 1}`;
      }

      const docRef = await addDoc(articlesRef, {
        ...article,
        publishDate: new Date().toISOString(),
        titleSlug: finalSlug
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding article:", error);
      throw error;
    }
  },

  getAuthor: async (limitCount: number = 5): Promise<Author[]> => {
    return fireServices.getDocuments(
      ["blog", DOCKET_DIGEST, AUTHORS],
      AUTHORS_ORDER_BY_FIELD,
      limitCount
    ) as Promise<Author[]>;
  },

  getCategories: async (limitCount: number = 5): Promise<Author[]> => {
    return fireServices.getDocuments(
      ["blog", DOCKET_DIGEST, CATEGORIES],
      CATEGORIES_ORDER_BY_FIELD,
      limitCount
    ) as Promise<Author[]>;
  },

  searchArticles: async (
    searchTerm: string,
    limitCount: number = 10
  ): Promise<ArticleWithDetails[]> => {
    try {
      const articlesRef = collection(db, "blog/blockchainBriefing/articles");
      const newsRef = collection(db, "blog/blockchainBriefing/newsletter");
  
      const [articlesSnapshot, newsSnapshot] = await Promise.all([
        getDocs(articlesRef),
        getDocs(newsRef),
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

  getFeaturedArticles: async (): Promise<ArticleWithDetails[]> => {
    const articlesRef = collection(db, "blog", DOCKET_DIGEST, ARTICLES);
    const q = query(articlesRef, where("featuredArticle", "==", true));
    const querySnapshot = await getDocs(q);

    const featuredArticles: ArticleWithDetails[] = [];

    for (const doc of querySnapshot.docs) {
      const article = doc.data() as ArticleWithDetails;
      article.id = doc.id;
      // Fetch author and category details
      featuredArticles.push(article);
    }
    const articlesWithDetails = await Promise.all(
      featuredArticles.map(async (article) => {
        let category = null;
        let author = null;

        if (article.categoryId) {
          try {
            const categoryDoc = await getDoc(
              doc(db, "blog", DOCKET_DIGEST, CATEGORIES, article.categoryId)
            );
            if (categoryDoc.exists()) {
              category = {
                id: categoryDoc.id,
                ...categoryDoc.data(),
              } as Category;
            }
          } catch (categoryError) {
            console.error(
              "Error fetching category for article:",
              article,
              categoryError
            );
          }
        }

        if (article.authorId) {
          try {
            const authorDoc = await getDoc(
              doc(db, "blog", DOCKET_DIGEST, AUTHORS, article.authorId)
            );
            if (authorDoc.exists()) {
              author = { id: authorDoc.id, ...authorDoc.data() } as Author;
            }
          } catch (authorError) {
            console.error(
              "Error fetching author for article:",
              article,
              authorError
            );
          }
        }

        return {
          ...article,
          category,
          author,
        };
      })
    );
    return articlesWithDetails;
  },
};
