"use client";

import React, { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where
} from "firebase/firestore";
import { generateSlug } from "@/lib/utils";
import DynamicBlog from "@/components/common/DynamicBlog";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { StaticImageData } from "next/image";
import user from '/assets/user.png'

import DummyImage from "@/assets/Blockchain-Default.jpg";
import ReactMarkdown from 'react-markdown';

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
  createdAt: string,
  status: string,
  position: string,
}

const NewsClient = ({ slug }: { slug: string }) => {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // console.log(slug, "slug");

   const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!db) {
        throw new Error("Database connection is not available");
      }

      const newsRef = collection(db, "blog/blockchainBriefing/newsletter");
      const q = query(newsRef, where("titleSlug", "==", slug));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn(`No news found for slug: ${slug}`);
        router.push("/404");
        return;
      }

      const newsDoc = querySnapshot.docs[0];
      const newsData = newsDoc.data() as News;

      if (!newsData) {
        throw new Error("News data is missing");
      }

      // 🔒 Check if the article is published
      if (newsData?.status !== "published") {
        console.warn(`Article with slug '${slug}' is not published`);
        router.push("/404");
        return;
      }


      const authorDoc = await getDoc(
        doc(db, "blog/blockchainBriefing/authors", newsData.authorId)
      );
      const authorName = authorDoc.exists()
        ? authorDoc.data().author_name
        : "Unknown Author";

      const authorPosition = authorDoc.exists()
        ? authorDoc.data().position
        : "Unknown position";

      const authorImage = authorDoc.exists()
        ? authorDoc.data().imageURL
        : "Unknown Image";

      // Format the publish date
      let formattedDate = "Unknown Date";
      if (newsData.createdAt) {
        try {
          const date = new Date(newsData?.createdAt);
          formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        } catch (error) {
          console.error("Error formatting date:", error);
        }
      }

      const newsItem: News = {
        ...newsData,
        id: newsDoc.id,
        authorName: authorName,
        authorImage: authorImage,
        position: authorPosition,
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
      <section className="container mx-auto px-4 py-8">
        {/* Main Heading */}
        <div className="flex items-center max-md:justify-center max-md:flex-col gap-2">
          <Skeleton className="h-8 w-32 bg-gray-100 sm:w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 bg-gray-100 rounded-full" />
            <Skeleton className="h-6 w-48 bg-gray-100 sm:w-32" />
          </div>
        </div>

        <div className="mt-14">
          <div className="space-y-3 mb-4">
            {/* Title Skeleton */}
            <div className="w-full">
              <Skeleton className="h-8 w-3/4 bg-gray-100 sm:w-1/2 lg:w-1/3" />
            </div>

            {/* Image Skeleton */}
            <div className="relative w-[90vw] max-w-[1200px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] overflow-hidden rounded-lg mx-auto">
              <Skeleton className="w-full h-full bg-gray-100 object-cover" />
            </div>

            {/* Author and Date Skeleton */}
            <div className="flex items-center sm:text-lg text-sm gap-2 flex-wrap">
              <Skeleton className="h-4 w-32 bg-gray-100 sm:w-24" />
              <Skeleton className="h-4 w-4 bg-gray-100 sm:w-3" />
              <Skeleton className="h-4 w-24 bg-gray-100 sm:w-20" />
            </div>
          </div>

          {/* Content Lines Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <Skeleton
                key={index}
                // className="h-4 w-full bg-gray-100 sm:w-[90%] md:w-[80%] lg:w-[70%]"
                className="h-4 w-full bg-gray-100 sm:w-[100%] md:w-[100%] lg:w-[100%]"
              />
            ))}
          </div>

          {/* Footer Skeleton */}
          <div className="my-8 flex w-full sm:flex-row flex-col gap-4 sm:justify-between sm:items-center justify-center">
            {/* Written By Skeleton */}
            <div className="flex gap-2 flex-col max-sm:justify-center max-sm:items-center">
              <Skeleton className="h-6 w-24 bg-gray-100" />
              <div className="w-12 h-12 relative rounded-full overflow-hidden">
                <Skeleton className="w-full h-full bg-gray-100" />
              </div>
              <Skeleton className="h-4 w-32 bg-gray-100 sm:w-24" />
              <Skeleton className="h-4 w-48 bg-gray-100 sm:w-32" />
            </div>

            {/* Social Media Skeleton */}
            <div className="flex items-center gap-3 sm:justify-between sm:items-center justify-center">
              {[1, 2].map((index) => (
                <Skeleton
                  key={index}
                  className="h-8 w-8 bg-gray-100 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!news) {
    return null;
  }

  return (
    <div className="w-full ">
      <DynamicBlog
        title={news.title}
       imageURL={news.imageURL || DummyImage}
        authorName={news.authorName || "Unknown Author"}
        authorPosition={news.position || "Unknown Position"}
        authorImg={news.authorImage || user}
        publishDate={news.formattedDate}
        content={news.content}
        titleSlug={news.titleSlug}
        isArticlePage={false}
        mainHeading="News"
      />
    </div>
  );
};

export default NewsClient;
