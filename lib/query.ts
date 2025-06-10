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
} from "firebase/firestore";

interface Article {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  authorId: string;
  authorName?: string;
  publishDate: {
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
      } catch (err) {
        console.error("Date formatting failed:", err);
      }
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

export const fetchNewsBySlug = async (slug: string): Promise<News | null> => {
  try {
    if (!db) throw new Error("Database connection is not available");

    const newsRef = collection(db, "blog/blockchainBriefing/newsletter");
    const q = query(newsRef, where("titleSlug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`No news found for slug: ${slug}`);
      return null;
    }

    const newsDoc = querySnapshot.docs[0];
    const newsData = newsDoc.data() as News;

    if (!newsData || newsData.status !== "published") {
      console.warn(`News not found or unpublished for slug: ${slug}`);
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
    } catch (err) {
      console.error("Date formatting failed:", err);
    }

    return {
      ...newsData,
      id: newsDoc.id,
      authorName,
      authorImage,
      position: authorPosition,
      formattedDate,
    };
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return null;
  }
};

export const fetchCombinedFeaturedItem = async () => {
  try {
    if (!db) {
      throw new Error("Database connection is not available");
    }

    const articlePath = "blog/blockchainBriefing/articles";
    const newsPath = "blog/blockchainBriefing/newsletter";

    const articleRef = collection(db, articlePath);
    const newsRef = collection(db, newsPath);

    // Build base queries for both
    const articleQuery = query(
      articleRef,
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );
    const newsQuery = query(
      newsRef,
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );

    // Fetch both sets
    const [articleSnap, newsSnap] = await Promise.all([
      getDocs(articleQuery),
      getDocs(newsQuery),
    ]);

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
                // @ts-ignore
                const authorData = authorSnap.data() as Author;
                authorName = authorData.author_name;
              }
            } catch (error) {
              console.error("Error fetching author:", error);
            }
          }

          return {
            id: docSnapshot.id,
            title: data.title || "",
            content: data.content || "",
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

    const [articles, newsletters] = await Promise.all([
      mergeAndProcess(articleSnap, "article"),
      mergeAndProcess(newsSnap, "newsletter"),
    ]);

    const combined = [...articles, ...newsletters];

    combined.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    // Find the latest featured item
    const latestFeatured = combined[0];
    return latestFeatured || null;
  } catch (error) {
    console.error("Error fetching combined featured item:", error);
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

  const [newslettersData, articlesData] = await Promise.all([
    fetchItems("blog/blockchainBriefing/newsletter", "newsletter"),
    fetchItems("blog/blockchainBriefing/articles", "article"),
  ]);

  const combined = [...newslettersData, ...articlesData];

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
