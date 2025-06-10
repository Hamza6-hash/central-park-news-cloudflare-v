"use client";

import React, { useState, useEffect } from "react";
import BlogsCard from "../common/BlogsCard";

import { db } from "@/lib/firebaseConfig";
// import DummyImg from "@/assets/Rectangle-4.png";
// import DummyImg from "@/assets/Blockchain-Default.jpg";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  DocumentData,
  limit,
  startAfter,
} from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import SuggestedBlogCard from "../common/SuggestedBlog";

// Define the type for a blog
interface Blog {
  id: string;
  title: string;
  content: string;
  // @ts-ignore
  imageURL: any;
  authorName: string;
  publishDate: {
    seconds: number;
    nanoseconds: number;
  };
  titleSlug: string;
  createdAt: string,
}

const SuggestedBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [articles, setArticles] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!db) {
        throw new Error("Database connection is not available");
      }

      const articlesRef = collection(db, "blog/blockchainBriefing/articles");
      const q = query(articlesRef,
        where("status", "==", "published"),
        orderBy("publishDate", "desc"),
        limit(6));

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setArticles([]);
        setLoading(false);
        return;
      }

      const articlesData = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
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
                const authorData = authorSnap.data();
                authorName = authorData.author_name || authorName;
              }
            } catch (error) {
              console.error("Error fetching author:", error);
            }
          }

          return {
            id: docSnapshot.id,
            title: data.title || "Untitled",
            content: data.content || "No content available.",
            imageURL: data.imageURL || "/Blockchain-Default.jpg",
            authorName: authorName,
            publishDate: data.publishDate || {
              seconds: new Date().getTime() / 1000,
              nanoseconds: 0,
            },
            titleSlug: data.titleSlug,
            createdAt: data.createdAt,
          };
        })
      );

      setArticles(articlesData);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to load articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="bg-[#67B6DF24] md:py-14 py-10 ">
      <div className="max-w-7xl mx-auto px-10">
        <h1 className="font-century-gothic font-bold text-[32px] mb-4 uppercase ">
          More Articles
        </h1>

        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 ">
            {loading
              ? [1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-gray-300 h-[320px] w-full rounded-md border-2 border-blue-500"
                >
                  <p className="p-4">Loading skeleton {item}</p>
                </div>
              ))
              : articles.map((blog) => (
                <div key={blog.id} className="w-full min-w-0">
                  <SuggestedBlogCard
                    title={blog.title}
                    content={blog.content}
                    imageURL={blog.imageURL}
                    authorName={blog.authorName}
                    publishDate={blog.publishDate}
                    createdAt={blog.createdAt}
                    titleSlug={blog.titleSlug}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedBlogs;
