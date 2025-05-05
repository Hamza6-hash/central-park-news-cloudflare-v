"use client";

import React, { useState, useEffect } from "react";
import BlogsCard from "../common/BlogsCard";

import { db } from "@/lib/firebaseConfig";
import DummyImg from "@/assets/Rectangle-4.png";

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
      const q = query(articlesRef, orderBy("publishDate", "desc"), limit(4));

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
            imageURL: data.imageURL || DummyImg,
            authorName: authorName,
            publishDate: data.publishDate || {
              seconds: new Date().getTime() / 1000,
              nanoseconds: 0,
            },
            titleSlug: data.titleSlug,
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
    // <div className="bg-[#67B6DF24]  md:py-14 py-10 flex items-center justify-center">
    <div className="bg-[#67B6DF24] py-10 flex items-center justify-center">
      <div className="max-width">
        <h1 className="font-century-gothic font-bold text-[32px] mb-7 uppercase">
          Articles
        </h1>
        {/* <div className="grid grid-cols-4 md:gap-4 gap-8 max-xl:grid-cols-2 max-md:grid-cols-1"> */}
        <div className="grid grid-cols-4 md:gap-1 gap-8 max-xl:grid-cols-2 max-md:grid-cols-1 ">
          {loading
            ? [1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-transparent h-40 w-full rounded-md"
                />
              ))
            : articles.map((blog) => (
                <React.Fragment key={blog.id}>
                  <BlogsCard
                    suggestedBlog={true}
                    showDateTimeInRow={false}
                    title={blog.title}
                    content={blog.content}
                    imageURL={blog.imageURL}
                    authorName={blog.authorName}
                    publishDate={blog.publishDate}
                    titleSlug={blog.titleSlug}
                  />
                </React.Fragment>
              ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedBlogs;
