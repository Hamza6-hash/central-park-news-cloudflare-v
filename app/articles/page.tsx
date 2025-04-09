"use client";

import DynamicBlog from "@/components/common/DynamicBlog";
import React, { useEffect, useState } from "react";
import DummyImg from "@/assets/Rectangle-2.png";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  Query,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import { format } from "date-fns";

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
  categoryId?: string;
  featuredArticle?: boolean;
  tags?: string;
  titleSlug?: string;
}

interface Author {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface ArticleWithAuthor extends Article {
  authorName: string;
  formattedDate?: string;
}

const Articles = () => {
  const [articles, setArticles] = useState<ArticleWithAuthor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = collection(
          db,
          "blog/blockchainBriefing/categories"
        );
        const categoriesSnapshot = await getDocs(categoriesRef);
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch articles based on selected category
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if database is available
        if (!db) {
          throw new Error("Database connection is not available");
        }

        // Fetch articles from the articles collection
        const articlesRef = collection(db, "blog/blockchainBriefing/articles");
        let articlesQuery: Query<DocumentData, DocumentData> = articlesRef;

        if (selectedCategory !== "all") {
          articlesQuery = query(
            articlesRef,
            where("categoryId", "==", selectedCategory)
          );
        }

        const articlesSnapshot = await getDocs(articlesQuery);

        if (articlesSnapshot.empty) {
          setError(
            "No articles available in this category. Please try another category."
          );
          setLoading(false);
          return;
        }

        // Process each article
        const articlesData = await Promise.all(
          articlesSnapshot.docs.map(async (articleDoc) => {
            const articleData = articleDoc.data() as Article;

            // Get author name from authors collection
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
              } catch (error) {
                console.error("Error fetching author:", error);
              }
            }

            // Format the date
            let formattedDate = "Unknown Date";
            if (articleData.publishDate) {
              try {
                const date = new Date(articleData.publishDate.seconds * 1000);
                formattedDate = date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              } catch (error) {
                console.error("Error formatting date:", error);
              }
            }

            return {
              ...articleData,
              id: articleDoc.id,
              authorName: authorName,
              date: formattedDate,
            };
          })
        );

        setArticles(articlesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Failed to load articles. Please try again later.");
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="bg-gray-100 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Articles</h1>
        {/* <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div> */}
      </div>

      <div className="grid gap-8">
        {articles.map((article) => {
          const baseSlug = article.title
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");

          const sameTitle = articles.filter(
            (a) => a.title?.toLowerCase() === article.title?.toLowerCase()
          );

          let finalSlug = baseSlug;
          if (sameTitle.length > 1) {
            const sortedArticles = [...sameTitle].sort(
              (a, b) => a.publishDate.seconds - b.publishDate.seconds
            );

            const index = sortedArticles.findIndex((a) => a.id === article.id);
            if (index > 0) {
              finalSlug = `${baseSlug}-${index + 1}`;
            }
          }

          return (
            <DynamicBlog
              key={article.id}
              mainHeading="Articles"
              title={article.title || ""}
              imageURL={article.imageURL || DummyImg}
              authorName={article.authorName || "Unknown Author"}
              publishDate={article.publishDate}
              content={article.content || ""}
              titleSlug={finalSlug}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Articles;
