"use client";

import React, { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { generateSlug } from "@/lib/utils";
import DynamicBlog from "@/components/common/DynamicBlog";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

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
}

const NewsClient = ({ slug }: { slug: string }) => {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

    //   console.log("Fetching news with slug:", slug);

      if (!db) {
        throw new Error("Database connection is not available");
      }

      const newsRef = collection(db, "blog/blockchainBriefing/newsletter");
      const querySnapshot = await getDocs(newsRef);

      let matchingNews = [];
      const baseSlug = slug.replace(/-\d+$/, "");
      const requestedNumber = slug.match(/-(\d+)$/)?.[1];

      for (const doc of querySnapshot.docs) {
        const data = doc.data() as News;
        const newsBaseSlug = data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        if (newsBaseSlug === baseSlug) {
          matchingNews.push({
            doc,
            data,
            date: data.date,
          });
        }
      }

      let newsDoc;
      let newsData;

      if (matchingNews.length > 0) {
        matchingNews.sort((a, b) => a.date.seconds - b.date.seconds);

        if (requestedNumber) {
          const index = parseInt(requestedNumber) - 1;
          if (index >= 0 && index < matchingNews.length) {
            newsDoc = matchingNews[index].doc;
            newsData = matchingNews[index].data;
          } else {
            // console.log("News number out of range:", requestedNumber);
            router.push("/404");
            return;
          }
        } else {
          newsDoc = matchingNews[0].doc;
          newsData = matchingNews[0].data;
        }
      } else {
        // console.log("No news items found with base slug:", baseSlug);
        router.push("/404");
        return;
      }

      if (!newsDoc) {
        const newsRef = doc(db, "blog/blockchainBriefing/newsletter", slug);
        const newsSnap = await getDoc(newsRef);

        if (newsSnap.exists()) {
          newsDoc = newsSnap;
          newsData = newsSnap.data() as News;
        } else {
          router.push("/404");
          return;
        }
      }

      if (!newsData) {
        throw new Error("News data is missing");
      }

      const authorDoc = await getDoc(doc(db, "blog/blockchainBriefing/authors", newsData.authorId));
      const authorName = authorDoc.exists() ? authorDoc.data().author_name : "Unknown Author";

      let formattedDate = "Unknown Date";
      if (newsData.date) {
        try {
          const timestamp = newsData.date;
          const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

          formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        } catch (error) {
          console.error("Error formatting date:", error);
        }
      }

      if (!newsData.titleSlug && newsDoc) {
        const slug = generateSlug(newsData.title, newsDoc.id);
        await updateDoc(newsDoc.ref, { titleSlug: slug });
        newsData.titleSlug = slug;
      }

      const newsItem: News = {
        ...newsData,
        id: newsDoc.id,
        authorName: authorName,
        formattedDate: formattedDate,
      };

      setNews(newsItem);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to fetch news");
      setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    fetchNews();
  }, [slug, fetchNews]);

  if (loading) {
    return (
      <div className="container mx-auto px-1 py-8">
        <div className="space-y-4 w-[90vw]">
          <Skeleton className="h-8 w-1/2 bg-gray-100" />
          <Skeleton className="h-[200px] w-full rounded-lg bg-gray-100" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32 bg-gray-100" />
            <Skeleton className="h-4 w-4 bg-gray-100" />
            <Skeleton className="h-4 w-24 bg-gray-100" />
          </div>
          <div className="space-y-4 mt-6">
            {[1, 2, 3, 4, 5].map((index) => (
              <Skeleton key={index} className="h-4 w-full bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DynamicBlog
        title={news.title}
        imageURL={news.imageURL || "/images/default-news.jpg"}
        authorName={news.authorName || "Unknown Author"}
        publishDate={news.date}
        content={news.content}
        titleSlug={news.titleSlug}
        isArticlePage={false}
        mainHeading="News"
      />
    </div>
  );
};

export default NewsClient;