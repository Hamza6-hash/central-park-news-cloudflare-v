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

interface Article {
  imageURL: string | StaticImport;
  id: string;
  title: string;
  content: string;
  publishDate: string;
  tags: string;
  authorId: string;
  categoryId: string;
  name: string;
  featuredArticle: boolean;
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
  titleSlug?: string;
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
      console.log('Searching for:', searchTerm);
      const articlesRef = collection(db, 'blog/blockchainBriefing/articles');
      
      // Get all articles
      const querySnapshot = await getDocs(articlesRef);
      console.log('Total articles found:', querySnapshot.size);
      
      const articles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Article[];

      // Filter articles that contain the search term in their title
      const matchingArticles = articles.filter(article => {
        const title = article.title?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return title.includes(search);
      });

      console.log('Matching articles:', matchingArticles.length);

      // Group articles by their base title slug
      const articlesBySlug = new Map<string, Article[]>();
      matchingArticles.forEach(article => {
        const baseSlug = article.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';
        if (!articlesBySlug.has(baseSlug)) {
          articlesBySlug.set(baseSlug, []);
        }
        articlesBySlug.get(baseSlug)?.push(article);
      });

      // Fetch category and author details for matching articles
      const articlesWithDetails = await Promise.all(
        matchingArticles.map(async (article) => {
          let category = null;
          let author = null;

          if (article.categoryId) {
            try {
              // Get all categories and find the one matching the categoryId
              const categoriesRef = collection(db, 'blog/blockchainBriefing/categories');
              const categoriesSnapshot = await getDocs(categoriesRef);
              const matchingCategory = categoriesSnapshot.docs.find(
                doc => doc.data().id === article.categoryId
              );

              if (matchingCategory) {
                const categoryData = matchingCategory.data();
                category = {
                  id: matchingCategory.id,
                  name: categoryData.name || 'Uncategorized',
                } as Category;
                console.log('Category found:', category);
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
                doc(db, 'blog/blockchainBriefing/authors', article.authorId)
              );
              if (authorDoc.exists()) {
                const authorData = authorDoc.data();
                author = { 
                  id: authorDoc.id, 
                  author_name: authorData.author_name || 'Unknown Author'
                } as Author;
              }
            } catch (authorError) {
              console.error(
                "Error fetching author for article:",
                article,
                authorError
              );
            }
          }

          // Generate titleSlug with numbering for duplicates
          const baseSlug = article.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';
          const articlesWithSameTitle = articlesBySlug.get(baseSlug) || [];
          let titleSlug = baseSlug;

          if (articlesWithSameTitle.length > 1) {
            // Sort articles by publish date
            articlesWithSameTitle.sort((a, b) => {
              const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
              const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
              return dateA - dateB;
            });

            // Find the index of this article in the sorted array
            const index = articlesWithSameTitle.findIndex(a => a.id === article.id);
            if (index > 0) {
              titleSlug = `${baseSlug}-${index + 1}`;
            }
          }

          return {
            ...article,
            category,
            author,
            titleSlug
          };
        })
      );

      console.log('Articles with details:', articlesWithDetails.length);
      return articlesWithDetails;
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
