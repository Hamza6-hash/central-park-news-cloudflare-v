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
  query,
  where,
} from "firebase/firestore";
import { formatedDate } from "@/lib/utils";
import Link from "next/link";
import { generateSlug } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { fireServices } from "./services/firestoreService";

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
      const articlesQuery = query(
        articlesRef,
        where("status", "==", "published")
      );
      const articlesSnapshot = await getDocs(articlesQuery);

      if (articlesSnapshot.empty) {
        setError("No articles available at the moment.");
        setLoading(false);
        return;
      }

      // Sort articles by publish date
      const articles = articlesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Article[];

      articles.sort(
        (a, b) => a.publishDate.seconds - b.publishDate.seconds
      );

      // Get the first article and its author
      const firstArticle = articles[0];

      // Get author name from authors collection
      const authorDoc = await getDoc(
        doc(db, "blog/blockchainBriefing/authors", firstArticle.authorId)
      );
      const authorName = authorDoc.exists()
        ? authorDoc.data().author_name
        : "Unknown Author";

      // Format the date
      let formattedDate = "Unknown Date";
      if (firstArticle.publishDate) {
        try {
          const timestamp = firstArticle.publishDate;
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

      setArticle({
        ...firstArticle,
        authorName: authorName,
        date: formattedDate,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching article:", error);
      setError("Failed to load article. Please try again later.");
      setLoading(false);
    }
  };

  const [stats, setStats] = useState<any>(null);
  console.log(stats)
  const fetchStats = async () => {
    try {
      const stats = await fireServices.getArticlesStats()
      setStats(stats)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      // setIsLoading(false)
    }
  }


  useEffect(() => {
    fetchStats()
    fetchArticle();
  }, []);

  if (loading) {
    return (
      <section className="flex gap-9 max-xl:flex-col w-full px-0 max-w-[1200px] mx-auto">
        <div className="xl:w-[644px] w-full max-w-full overflow-hidden">
          <div className="space-y-3 mb-4 px-4">
            <Skeleton className="h-8 w-3/4 bg-gray-100" />
            <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] max-w-full">
              <Skeleton className="h-full w-full rounded-lg bg-gray-100" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 bg-gray-100" />
              <Skeleton className="h-4 w-32 bg-gray-100" />
              <Skeleton className="h-4 w-4 bg-gray-100" />
              <Skeleton className="h-4 w-24 bg-gray-100" />
            </div>
          </div>
          <div className="px-4 space-y-4">
            {[1, 2, 3, 4].map((index) => (
              <Skeleton key={index} className="h-4 w-full bg-gray-100" />
            ))}
          </div>
        </div>
        <div className="xl:w-[520px] w-full">
          <TopStories />
        </div>
      </section>
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
    <section className="flex gap-9 max-xl:flex-col w-full px-0 max-w-[1200px] mx-auto text-[12px] sm:text-base">
      <div className="xl:w-[644px] w-full max-w-full overflow-hidden">
        <div className="space-y-3 mb-4 px-4">
          <Link
            href={`/articles/${article.titleSlug
              }`}
          >
            <h1 className="font-century-schoolbook sm:text-[12px] text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl capitalize hover:text-primary-500 transition-colors break-words max-w-full">
              {article.title}
            </h1>
          </Link>

          <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] max-w-full">
            <Image
              src={article.imageURL || "no-image"}
              alt="Description of image"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 320px) 100vw, (max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="flex items-center text-[12px] sm:text-xs md:text-sm lg:text-base gap-2 flex-wrap">
            <hr className="w-4 sm:w-6 h-1" />
            <h6 className="capitalize font-montserrat text-[12px] sm:text-xs md:text-sm lg:text-base">
              {article.authorName}
            </h6>
            <span className="text-primary-500">|</span>
            <p className="text-primary-500 italic font-montserrat text-[12px] sm:text-xs md:text-sm lg:text-base">
              {article.date}
            </p>
          </div>
        </div>
        <article className="w-full font-montserrat font-normal text-[12px] sm:text-[12px] md:text-sm lg:text-base xl:text-[18px] leading-[1.8] tracking-[0%] text-justify capitalize break-words px-4">
          {article.content.split("\n\n").map((paragraph, index) => (
            <p
              key={index}
              className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-10 last:mb-0 font-montserrat font-normal"
            >
              {paragraph.trim()}
            </p>
          ))}
        </article>

        {/* -------------- 600x600 ad bar -------------------- */}
        <div className="mb-6 mt-10 p-3 md:p-0 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Share Section */}
          <div className="flex flex-col items-start md:items-start">
            <p className="font-bold mb-2">Share This:</p>
            <div className="flex gap-4">
              {socialMediaArray.map((item) => (
                <React.Fragment key={item.link}>
                  <SocialMediaTag icon={item.icon} link={item.link} />
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 300x300 Ad */}
          <div className="w-full max-w-[300px] aspect-square bg-primary-100 flex items-center justify-center">
            Ad Space (300x300)
          </div>

        </div>

        {/* Responsive 600x314 Ad */}
        <div className="w-full aspect-[1.91] bg-primary-100 flex justify-center items-center">
          Advertisement
        </div>


      </div>

      <div className="xl:w-[520px] w-full">
        <TopStories />
      </div>
    </section>
  );
}
