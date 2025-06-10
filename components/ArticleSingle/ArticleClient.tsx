"use client";

import React, { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDoc, getDocs, updateDoc, query, where } from "firebase/firestore";
import { generateSlug } from "@/lib/utils";
import DynamicBlog from "@/components/common/DynamicBlog";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { StaticImageData } from "next/image";
import user from '/assets/user.png'
// import DummyImage from "@/assets/Blockchain-Default.jpg";


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
  createdAt: string,
  position: string,
  authorImage: string | StaticImageData;
}

const ArticleClient = ({ slug }: { slug: string }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchArticle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!db) {
        throw new Error("Database connection is not available");
      }

      const articlesRef = collection(db, "blog/blockchainBriefing/articles");
      const q = query(articlesRef, where("titleSlug", "==", slug));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // console.warn(`No article found for slug: ${slug}`);
        router.push("/404");
        return;
      }
      const articleDoc = querySnapshot.docs[0];
      const articleData = articleDoc.data() as Article;

      if (!articleData) {
        throw new Error("Article data is missing");
      }
      if (articleData?.status !== "published") {
        // console.warn(`Article with slug '${slug}' is not published`);
        router.push("/404");
        return;
      }

      const authorDoc = await getDoc(doc(db, "blog/blockchainBriefing/authors", articleData.authorId));
      const authorName = authorDoc.exists() ? authorDoc.data().author_name : "Unknown Author";
      const authorPosition = authorDoc.exists() ? authorDoc.data().position : "Unknown Position";
      const authorImg = authorDoc.exists() ? authorDoc.data().imageURL : "Unknown Image";

      // Format the publish date
      let formattedDate = "Unknown Date";
      if (articleData.createdAt) {
        try {
          const date = new Date(articleData?.createdAt);
          formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        } catch (error) {
          console.error("Error formatting date:", error);
        }
      }


      const article: Article = {
        ...articleData,
        id: articleDoc.id,
        authorName: authorName,
        position: authorPosition,
        authorImage: authorImg,
        createdAt: formattedDate,
      };

      setArticle(article);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching article:", error);
      setError("Failed to fetch article");
      setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    fetchArticle();
  }, [slug, fetchArticle]);

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
                // className="h-4 w-full bg-gray-100 sm:w-[90%] md:w-[90%] lg:w-[90%]"
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

  if (!article) {
    return null;
  }

  return (
    <div className="w-full">
      <DynamicBlog
        title={article.title}
        imageURL={article.imageURL || "/Blockchain-Default.jpg"}
        authorName={article.authorName || "Unknown Author"}
        authorPosition={article?.position || "Unknown positon"}
        authorImg={article?.authorImg || user}
        publishDate={article.createdAt}
        content={article.content}
        titleSlug={article.titleSlug}
        isArticlePage={true}
        mainHeading="Article"
      />
    </div>
  );
};

export default ArticleClient;