"use client";
import TopStories from "@/components/topStories/TopStories";
import Image from "next/image";
import DummyImage from "@/assets/Rectangle-2.png";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { formatedDate } from "@/lib/utils";
import Link from "next/link";
import { generateSlug } from "@/lib/utils";
import { useParams } from "next/navigation";

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
}

interface SocialMedia {
  icon: React.ReactNode;
  link: string;
}

const SocialMediaTag = ({ icon, link }: SocialMedia) => {
  return (
    <div className="rounded-full border border-primary-500 p-2 cursor-pointer">
      {icon}
    </div>
  );
};

const socialMediaArray = [
  {
    icon: <FaTwitter className="text-primary-500" size={20} />,
    link: "",
  },
  {
    icon: <FaFacebookSquare className="text-primary-500" size={20} />,
    link: "",
  },
];

export default function Home() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if database is available
      if (!db) {
        throw new Error("Database connection is not available");
      }

      // Fetch articles from the articles collection
      const articlesRef = collection(db, "blog/blockchainBriefing/articles");
      const articlesSnapshot = await getDocs(articlesRef);

      if (articlesSnapshot.empty) {
        setError("No articles available at the moment.");
        setLoading(false);
        return;
      }

      // Process all articles to handle duplicate titles
      const articlesMap = new Map();
      const articles = articlesSnapshot.docs.map((doc) => {
        const data = doc.data() as Article;
        const baseSlug = data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        // Count how many articles have this base slug
        const count = articlesMap.get(baseSlug) || 0;
        articlesMap.set(baseSlug, count + 1);

        return {
          doc,
          data,
          baseSlug,
          count: count + 1,
        };
      });

      // Sort articles by publish date
      articles.sort(
        (a, b) => a.data.publishDate.seconds - b.data.publishDate.seconds
      );

      // Get the first article and its author
      const firstArticle = articles[0];
      const articleData = firstArticle.data;

      // Get author name from authors collection
      const authorDoc = await getDoc(
        doc(db, "blog/blockchainBriefing/authors", articleData.authorId)
      );
      const authorName = authorDoc.exists()
        ? authorDoc.data().author_name
        : "Unknown Author";

      // Format the date
      let formattedDate = "Unknown Date";
      if (articleData.publishDate) {
        try {
          const timestamp = articleData.publishDate;
          const date = new Date(
            timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
          );

          formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        } catch (error) {
          console.error("Error formatting date:", error);
        }
      }

      // Generate slug for the article
      const slug = generateSlug(articleData.title, firstArticle.doc.id);

      setArticle({
        ...articleData,
        id: firstArticle.doc.id,
        authorName: authorName,
        date: formattedDate,
        titleSlug: slug,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching article:", error);
      setError("Failed to load article. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={fetchArticle}
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <p className="text-gray-500 text-lg">No article found.</p>
      </div>
    );
  }

  return (
    <section className="flex gap-9 max-xl:flex-col w-full px-0 max-w-[1200px] mx-auto">
    <div className="xl:w-[644px] w-full max-w-full overflow-hidden">
        <div className="space-y-3 mb-4 px-4">
            <Link href={`/articles/${article.titleSlug?.split('-').slice(0, -1).join('-') || article.id}`}>
                <h1 className="font-century-schoolbook text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl capitalize hover:text-primary-500 transition-colors break-words max-w-full">
                    {article.title}
                </h1>
            </Link>

            <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] max-w-full">
                <Image
                    src={article.imageURL || 'no-image'}
                    alt="Description of image"
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 320px) 100vw, (max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="flex items-center text-[10px] sm:text-xs md:text-sm lg:text-base gap-2 flex-wrap">
                <hr className="w-4 sm:w-6 h-1" />
                <h6 className="capitalize font-montserrat text-[10px] sm:text-xs md:text-sm lg:text-base">{article.authorName}</h6>
                <span className="text-primary-500">|</span>
                <p className="text-primary-500 italic font-montserrat text-[10px] sm:text-xs md:text-sm lg:text-base">{article.date}</p>
            </div>
        </div>
        <article className="w-full font-montserrat font-normal text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-[18px] leading-[1.8] tracking-[0%] text-justify capitalize text-gray-600 break-words px-4">
            {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-10 last:mb-0">{paragraph.trim()}</p>
            ))}
        </article>

        <div className="my-4 sm:my-6 md:my-8 lg:my-10 px-4">
            <p className="font-bold mb-2 text-[10px] sm:text-xs md:text-sm lg:text-base">Share This:</p>
            <div className="flex gap-2 sm:gap-4">
                {socialMediaArray.map((item, index) => (
                    <SocialMediaTag key={index} {...item} />
                ))}
            </div>
        </div>
    </div>
    <div className="xl:w-[520px] w-full">
        <TopStories />
    </div>
</section>
  );
}
