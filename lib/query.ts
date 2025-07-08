import { StaticImageData } from "next/image";
import { db } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  Timestamp,
  DocumentData,
  startAfter,
  limit,
  getCountFromServer,
} from "firebase/firestore";
import { defultImage } from "@/constants";

interface Article {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  authorId: string;
  authorName?: string;
  publishDate:
    | string
    | {
        seconds: number;
        nanoseconds: number;
      };
  date?: string;
  titleSlug?: string;
  status?: string;
  Position?: string;
  authorImg: string | StaticImageData;
  createdAt: string;
  position: string;
  authorImage: string | StaticImageData;
  type?: "article" | "news";
  category_name?: string;
  category?: string;
  isFeatured?: boolean;
}
interface News {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  authorId: string;
  authorName?: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
  formattedDate?: string;
  titleSlug?: string;
  authorPosition?: string;
  authorImage: string | StaticImageData;
  createdAt: string;
  status: string;
  position: string;
  category?: string;
  isFeatured?: boolean;
}

interface Newsletter {
  id: string;
  title?: string;
  content?: string;
  authorId?: string;
  authorName?: string;
  date?: Timestamp;
  imageURL?: string;
  titleSlug?: string;
  status: string;
  createdAt?: string;
  isFeatured: boolean;
  updatedAt: string;
  type?: string;
}

export const fetchArticleBySlug = async (
  slug: string
): Promise<Article | null> => {
  try {
    const articlesRef = collection(db, "blog/blockchainBriefing/articles");
    const q = query(articlesRef, where("titleSlug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const articleDoc = querySnapshot.docs[0];
    const articleData = articleDoc.data() as Article;

    if (!articleData || articleData.status !== "published") {
      return null;
    }

    const authorRef = doc(
      db,
      "blog/blockchainBriefing/authors",
      articleData.authorId
    );
    const authorDoc = await getDoc(authorRef);

    const authorName = authorDoc.exists()
      ? authorDoc.data().author_name
      : "Unknown Author";
    const authorPosition = authorDoc.exists()
      ? authorDoc.data().position
      : "Unknown Position";
    const authorImage = authorDoc.exists() ? authorDoc.data().imageURL : "";

    let formattedDate = "Unknown Date";
    if (articleData.createdAt) {
      try {
        const date = new Date(articleData.createdAt);
        formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch (err) {}
    }

    return {
      ...articleData,
      id: articleDoc.id,
      authorName,
      position: authorPosition,
      authorImage,
      createdAt: formattedDate,
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
};

export const fetchCombinedFeaturedItem = async () => {
  try {
    if (!db) {
      throw new Error("Database connection is not available");
    }

    const newsPath = "blog/blockchainBriefing/newsletter";
    const newsRef = collection(db, newsPath);

    const newsQuery = query(
      newsRef,
      where("status", "==", "published"),
      orderBy("createdAt", "desc"),
      limit(1) 
    );

    const newsSnap = await getDocs(newsQuery);

    const mergeAndProcess = async (snap: any, type: string) => {
      return Promise.all(
        snap.docs.map(async (docSnapshot: any) => {
          const data = docSnapshot.data();
          let authorName = "Docket Digest News Room";

          if (data.authorId) {
            try {
              const authorRef = doc(
                db,
                "blog/blockchainBriefing/authors",
                data.authorId
              );
              const authorSnap = await getDoc(authorRef);
              if (authorSnap.exists()) {
                const authorData = authorSnap.data() as Author;
                authorName = authorData.author_name;
              }
            } catch (error) {}
          }

          return {
            id: docSnapshot.id,
            title: data.title || "",
            content: data.content || "",
            category: data.category || "N/A",
            imageURL: data.imageURL,
            authorId: data.authorId || "",
            authorName,
            titleSlug: data.titleSlug || "",
            type,
            createdAt: data.createdAt,
            isFeatured: data.isFeatured || false,
            publishDate: {
              seconds: data.date?.seconds || new Date().getTime() / 1000,
              nanoseconds: data.date?.nanoseconds || 0,
            },
          };
        })
      );
    };

    const newsletters = await mergeAndProcess(newsSnap, "newsletter");
    const latestFeatured = newsletters[0];
    return latestFeatured || null;
  } catch (error) {
    console.error("Error fetching combined featured item:", error);
    return null;
  }
};

export const FetchTopStories = async (): Promise<Newsletter[]> => {
  if (!db) {
    throw new Error("Database connection is not available");
  }

  const fetchItems = async (collectionPath: string, type: string) => {
    const ref = collection(db, collectionPath);
    const snapshot = await getDocs(ref);

    if (snapshot.empty) return [];

    return await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        try {
          let authorName = "Docket Digest New Room";
          if (data.authorId) {
            const authorRef = doc(
              db,
              "blog/blockchainBriefing/authors",
              data.authorId
            );
            const authorDoc = await getDoc(authorRef);
            if (authorDoc.exists()) {
              const authorData = authorDoc.data() as DocumentData;
              authorName = authorData.author_name || "Docket Digest New Room";
            }
          }
          return {
            ...data,
            id: docSnap.id,
            authorName,
            titleSlug: data.titleSlug || "",
            date: data.date as Timestamp,
            createdAt: data.createdAt,
            status: data.status,
            type: data.type,
            isFeatured: data.isFeatured || false,
            updatedAt: data.updatedAt,
          } as Newsletter;
        } catch (error) {
          console.error(`Error processing ${type}:`, docSnap.id, error);
          return {
            ...data,
            id: docSnap.id,
            authorName: "Docket Digest New Room",
            titleSlug: data.titleSlug || "",
            status: data.status,
            type: data.type,
            isFeatured: data.isFeatured || false,
            updatedAt: data.updatedAt,
          } as Newsletter;
        }
      })
    );
  };

  const [newslettersData] = await Promise.all([
    fetchItems("blog/blockchainBriefing/newsletter", "newsletter"),
  ]);

  const combined = [...newslettersData];

  const publishedItems = combined.filter(
    (item) => item?.status === "published"
  );

  const sortedItems = publishedItems.sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const latestItems = sortedItems.filter((item) => item.isFeatured === true);

  return latestItems.slice(0, 7);
};

export const FetchLatestNews = async (): Promise<Article[] | undefined> => {
  try {
    if (!db) throw new Error("Database connection is not available");

    const collectionPath = "blog/blockchainBriefing/newsletter";

    // const collectionPath = pathname.includes("/news")
    //   ? "blog/blockchainBriefing/articles"
    //   : pathname.includes("/articles")
    //   ? "blog/blockchainBriefing/newsletter"
    //   : "blog/blockchainBriefing/articles";

    const articlesRef = collection(db, collectionPath);
    const articlesQuery = query(
      articlesRef,
      where("status", "==", "published"),
      orderBy("createdAt", "desc"),
      limit(12)
    );
    const articlesSnapshot = await getDocs(articlesQuery);

    if (articlesSnapshot.empty) return [];

    const articlesData = await Promise.all(
      articlesSnapshot.docs.map(async (articleDoc) => {
        const articleData = articleDoc.data() as Article;

        let authorName = "Unknown Author";
        if (articleData.authorId) {
          try {
            const authorDocRef = doc(
              db,
              "blog/blockchainBriefing/authors",
              articleData.authorId
            );
            const authorDoc = await getDoc(authorDocRef);
            if (authorDoc.exists()) {
              const authorData = authorDoc.data() as DocumentData;
              authorName = authorData.author_name || "Unknown Author";
            }
          } catch (error) {}
        }

        let formattedDate = "Unknown Date";
        if (articleData.createdAt) {
          try {
            const date = new Date(articleData.createdAt);
            formattedDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          } catch (error) {}
        }

        return {
          ...articleData,
          id: articleDoc.id,
          authorName,
          formattedDate,
          createdAt: articleData?.createdAt || formattedDate,
          publishDate: formattedDate,
          titleSlug: articleData.titleSlug,
          type: collectionPath.includes("newsletter")
            ? ("news" as const)
            : ("article" as const),
        };
      })
    );

    articlesData.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return articlesData;
  } catch (error) {
    return [];
  }
};

interface Category {
  full_name: string;
}

interface Author {
  author_name: string;
}

interface FetchArticlesParams {
  activeTab: "news" | "article";
  currentPage: number;
  itemsPerPage?: number;
}

interface FetchArticlesResult {
  items: Article[];
  totalPages: number;
  totalItems: number;
}

// export const FetchArticleNewsData = async ({
//   activeTab,
//   currentPage,
//   itemsPerPage = 9,
// }: FetchArticlesParams): Promise<FetchArticlesResult> => {
//   if (!db) {
//     throw new Error("Database connection is not available");
//   }

//   const collectionPath =
//     activeTab === "article"
//       ? "blog/blockchainBriefing/articles"
//       : "blog/blockchainBriefing/newsletter";

//   const itemsRef = collection(db, collectionPath);

//   const baseQuery = query(
//     itemsRef,
//     where("status", "==", "published"),
//     orderBy("createdAt", "desc")
//   );

//   const totalSnapshot = await getDocs(baseQuery);
//   const totalItems = totalSnapshot.docs.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);

//   const startAt = (currentPage - 1) * itemsPerPage;
//   const startDoc = startAt > 0 ? totalSnapshot.docs[startAt - 1] : null;

//   const q = startDoc
//     ? query(baseQuery, startAfter(startDoc), limit(itemsPerPage))
//     : query(baseQuery, limit(itemsPerPage));

//   const snapshot = await getDocs(q);

//   if (snapshot.empty) {
//     return {
//       items: [],
//       totalPages,
//       totalItems,
//     };
//   }

//   const itemsData = await Promise.all(
//     snapshot.docs.map(async (docSnapshot) => {
//       const data = docSnapshot.data();
//       let authorName = "Docket Digest News Room";
//       let category_name = "CryptoCurrency";

//       if (data.authorId) {
//         try {
//           const authorRef = doc(
//             db,
//             "blog/blockchainBriefing/authors",
//             data.authorId
//           );
//           const authorSnap = await getDoc(authorRef);
//           if (authorSnap.exists()) {
//             const authorData = authorSnap.data() as Author;
//             authorName = authorData.author_name;
//           }
//         } catch (error) {}
//       }

//       if (data.categoryId) {
//         try {
//           const categoriesRef = collection(
//             db,
//             "blog/blockchainBriefing/categories"
//           );
//           const categoryQuery = query(
//             categoriesRef,
//             where("id", "==", data.categoryId)
//           );
//           const categorySnapshot = await getDocs(categoryQuery);

//           if (!categorySnapshot.empty) {
//             const categoryDoc = categorySnapshot.docs[0];
//             const categoryData = categoryDoc.data() as Category;
//             category_name = categoryData.full_name;
//           } else {
//           }
//         } catch (error) {
//           console.error("Error fetching category:", error);
//         }
//       }

//       return {
//         id: docSnapshot.id,
//         title: data.title || "",
//         content: data.content || "",
//         imageURL: data.imageURL || defultImage,
//         isFeatured: data.isFeatured,
//         authorId: data.authorId || "",
//         authorName: authorName,
//         categoryId: data.categoryId,
//         category_name: category_name,
//         titleSlug: data.titleSlug || "",
//         type: activeTab,
//         createdAt: data.createdAt,
//         publishDate: {
//           seconds: data.date?.seconds || new Date().getTime() / 1000,
//           nanoseconds: data.date?.nanoseconds || 0,
//         },
//       };
//     })
//   );

//   return {
//     // @ts-ignore
//     items: itemsData,
//     totalPages,
//     totalItems,
//   };
// };

export const fetchNewsBySlug = async (slug: string): Promise<News | null> => {
  try {
    if (!db) throw new Error("Database connection is not available");

    const newsRef = collection(db, "blog/blockchainBriefing/newsletter");
    const q = query(newsRef, where("titleSlug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const newsDoc = querySnapshot.docs[0];
    const newsData = newsDoc.data() as News;

    if (!newsData || newsData.status !== "published") {
      return null;
    }

    const authorDoc = await getDoc(
      doc(db, "blog/blockchainBriefing/authors", newsData.authorId)
    );

    const authorName = authorDoc.exists()
      ? authorDoc.data().author_name
      : "Unknown Author";
    const authorPosition = authorDoc.exists()
      ? authorDoc.data().position
      : "Unknown Position";
    const authorImage = authorDoc.exists()
      ? authorDoc.data().imageURL
      : "/default-avatar.png";

    let formattedDate = "Unknown Date";
    try {
      const date = new Date(newsData.createdAt);
      formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {}

    const protectedImageURL = newsData.imageURL
  ? `/api/protected-image?url=${encodeURIComponent(newsData.imageURL)}`
  : "/default-image.png"; // fallback


    return {
      ...newsData,
      imageURL: protectedImageURL,
      id: newsDoc.id,
      authorName: authorName,
      authorImage,
      authorPosition: authorPosition,
      formattedDate,
    };
  } catch (error) {
    return null;
  }
};

interface FetchArticlesParams {
  activeTab: "article" | "news";
  currentPage: number;
  itemsPerPage?: number;
}

interface FetchArticlesResult {
  items: Article[];
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const totalCountCache = new Map<string, { count: number; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; 

export const FetchArticleNewsData = async ({
  activeTab,
  currentPage,
  itemsPerPage = 9,
}: FetchArticlesParams): Promise<FetchArticlesResult> => {
  if (!db) {
    throw new Error("Database connection is not available");
  }

  const collectionPath =
    activeTab === "article"
      ? "blog/blockchainBriefing/articles"
      : "blog/blockchainBriefing/newsletter";

  const itemsRef = collection(db, collectionPath);
  const baseQuery = query(
    itemsRef,
    where("status", "==", "published"),
    orderBy("createdAt", "desc")
  );

  // Get total count with caching to avoid expensive repeated queries
  const cacheKey = `${collectionPath}_count`;
  let totalItems = 0;

  const cachedCount = totalCountCache.get(cacheKey);
  const now = Date.now();

  if (cachedCount && now - cachedCount.timestamp < CACHE_DURATION) {
    totalItems = cachedCount.count;
  } else {
    // Use getCountFromServer for better performance (Firestore v9+)
    try {
      const countSnapshot = await getCountFromServer(baseQuery);
      totalItems = countSnapshot.data().count;
    } catch (error) {
      // Fallback to getDocs if getCountFromServer is not available
      console.warn(
        "getCountFromServer failed, falling back to getDocs:",
        error
      );
      const totalSnapshot = await getDocs(baseQuery);
      totalItems = totalSnapshot.docs.length;
    }

    // Cache the result
    totalCountCache.set(cacheKey, { count: totalItems, timestamp: now });
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Validate page bounds
  if (currentPage < 1 || currentPage > totalPages) {
    return {
      items: [],
      totalPages,
      totalItems,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }

  // Create efficient paginated query using startAfter for better performance
  let paginatedQuery = query(baseQuery, limit(itemsPerPage));

  // For pages beyond the first, we need to skip to the correct position
  if (currentPage > 1) {
    const skipCount = (currentPage - 1) * itemsPerPage;

    // Get the document to start after (this is still not ideal for very large skip counts)
    // For better performance with large datasets, consider using cursor-based pagination
    const skipQuery = query(baseQuery, limit(skipCount));
    const skipSnapshot = await getDocs(skipQuery);

    if (!skipSnapshot.empty && skipSnapshot.docs.length === skipCount) {
      const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
      paginatedQuery = query(
        baseQuery,
        startAfter(lastDoc),
        limit(itemsPerPage)
      );
    } else {
      // Fallback: this should not happen in normal circumstances
      paginatedQuery = query(baseQuery, limit(itemsPerPage));
    }
  }

  const snapshot = await getDocs(paginatedQuery);

  if (snapshot.empty) {
    return {
      items: [],
      totalPages,
      totalItems,
      hasNextPage: false,
      hasPrevPage: currentPage > 1,
    };
  }

  // Batch fetch authors and categories to reduce database calls
  const authorIds = new Set<string>();
  const categoryIds = new Set<string>();

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.authorId) authorIds.add(data.authorId);
    if (data.categoryId) categoryIds.add(data.categoryId);
  });

  // Fetch all authors in batch
  const authorsMap = new Map<string, Author>();
  if (authorIds.size > 0) {
    try {
      const authorsRef = collection(db, "blog/blockchainBriefing/authors");
      const authorQuery = query(
        authorsRef,
        where("__name__", "in", Array.from(authorIds))
      );
      const authorSnapshot = await getDocs(authorQuery);

      authorSnapshot.docs.forEach((doc) => {
        authorsMap.set(doc.id, doc.data() as Author);
      });
    } catch (error) {
      console.error("Error fetching authors in batch:", error);
    }
  }

  // Fetch all categories in batch
  const categoriesMap = new Map<string, Category>();
  if (categoryIds.size > 0) {
    try {
      const categoriesRef = collection(
        db,
        "blog/blockchainBriefing/categories"
      );
      const categoryQuery = query(
        categoriesRef,
        where("id", "in", Array.from(categoryIds))
      );
      const categorySnapshot = await getDocs(categoryQuery);

      categorySnapshot.docs.forEach((doc) => {
        const categoryData = doc.data() as Category;
        // @ts-ignore
        categoriesMap.set(categoryData.id, categoryData);
      });
    } catch (error) {
      console.error("Error fetching categories in batch:", error);
    }
  }

  // Process items with batched data
  const itemsData = snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data();

    const authorName =
      data.authorId && authorsMap.has(data.authorId)
        ? authorsMap.get(data.authorId)!.author_name
        : "Docket Digest News Room";

    const category_name =
      data.categoryId && categoriesMap.has(data.categoryId)
        ? categoriesMap.get(data.categoryId)!.full_name
        : "CryptoCurrency";

    return {
      id: docSnapshot.id,
      title: data.title || "",
      content: data.content || "",
      imageURL: data.imageURL || defultImage,
      isFeatured: data.isFeatured || false,
      authorId: data.authorId || "",
      authorName: authorName,
      categoryId: data.categoryId || "",
      category_name: category_name,
      titleSlug: data.titleSlug || "",
      type: activeTab,
      createdAt: data.createdAt || "",
      publishDate: {
        seconds: data.date?.seconds || Math.floor(new Date().getTime() / 1000),
        nanoseconds: data.date?.nanoseconds || 0,
      },
      date: data.date || "",
      status: data.status || "published",
      Position: data.Position || "",
      authorImg: data.authorImg || defultImage,
      position: data.position || "",
      authorImage: data.authorImage || defultImage,
    } as Article;
  });

  return {
    items: itemsData,
    totalPages,
    totalItems,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};



// ------------------ markdown remove function --------------

export function stripMarkdown(markdown: string) {
  return markdown
    .replace(/!\[.*?\]\(.*?\)/g, "") 
    .replace(/\[.*?\]\(.*?\)/g, "") 
    .replace(/[*_~`>#-]/g, "") 
    .replace(/\n+/g, " ") 
    .trim();
}
