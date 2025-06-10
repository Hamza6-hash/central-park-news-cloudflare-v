"use client";
import TopStories from "@/components/topStories/TopStories";
import Image, { StaticImageData } from "next/image";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import React from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  // updateDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { formatedDate } from "@/lib/utils";
import Link from "next/link";
// import { generateSlug } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
// import { fireServices } from "./services/firestoreService";
import ReactMarkdown from 'react-markdown';
import { useQuery } from '@tanstack/react-query';
import { defultImage } from "@/constants";


interface Article {
  id: string;
  title: string;
  content: string;
  imageURL?: string | StaticImageData;
  authorId: string;
  authorName?: string;
  publishDate: {
    seconds: number;
    nanoseconds: number;
  };
  date?: string;
  titleSlug?: string;
  createdAt: string,
  type: string
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
  const params = useParams();

  const fetchCombinedFeaturedItem = async (): Promise<Article> => {
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
      getDocs(newsQuery)
    ]);

    const mergeAndProcess = async (snap: any, type: string) => {
      return Promise.all(
        snap.docs.map(async (docSnapshot: any) => {
          const data = docSnapshot.data();
          let authorName = "Docket Digest News Room";

          if (data.authorId) {
            try {
              const authorRef = doc(db, "blog/blockchainBriefing/authors", data.authorId);
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
              nanoseconds: data.date?.nanoseconds || 0
            }
          };
        })
      );
    };

    const [articles, newsletters] = await Promise.all([
      mergeAndProcess(articleSnap, "article"),
      mergeAndProcess(newsSnap, "newsletter")
    ]);

    const combined = [...articles, ...newsletters];

    combined.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    // Find the latest featured item
    const latestFeatured = combined[0];
    if (!latestFeatured) {
      throw new Error("No articles found");
    }
    return latestFeatured;
  };

  const {
    data: article,
    isLoading: loading,
    error
  } = useQuery<Article>({
    queryKey: ["featuredArticle"],
    queryFn: fetchCombinedFeaturedItem,
    retry: 2,
    staleTime: 1000 * 60 * 7, // 7 minutes
  });

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
        <p className="text-red-500 text-lg mb-4">{error.message}</p>
        <button
          // onClick={"fetchArticle"}
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
    <section className="flex gap-9 max-xl:flex-col w-full max-w-[1200px] mx-auto text-[12px] sm:text-base">
      <div className="xl:w-[644px] w-full max-w-full overflow-hidden">

        <hr className={`w-64 h-0.5 mb-2 bg-gray-200`} />
        <div className="space-y-3 mb-4">
          <Link
            href={`/${article.type === 'newsletter' ? 'news' : 'articles'}/${article.titleSlug
              }`}
          >
            <h1 className="font-century-schoolbook sm:text-[12px] text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl capitalize hover:text-primary-500 transition-colors break-words max-w-full line-clamp-2">
              {article.title}
            </h1>
          </Link>

          <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] max-w-full">
            <Image
              src={article.imageURL || defultImage}
              alt="Description of image"
              fill
              className="object-cover rounded-sm"
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
              {article.createdAt
                ? formatedDate(article.createdAt) : "N/A"}
            </p>
          </div>
        </div>

        <div className="markdown-content  ">
          <ReactMarkdown>{article?.content}</ReactMarkdown>
        </div>

        {/* -------------- 600x600 ad bar -------------------- */}
        <div className="flex flex-col w-full mb-6 mt-10 sm:px-3 md:p-4 gap-4 items-end justify-end">
          {/* Top Row: Share Title + Square Ad */}
          <div className="flex w-full flex-col max-[360px]:items-start sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col">
              <p className="font-bold mb-2">Share This:</p>
            </div>
            {/* Responsive Square Ad Box (maintains 1:1 aspect ratio) */}
            <div className="w-full max-w-[300px] aspect-square bg-primary-100 flex items-center justify-center shrink-0 min-w-[150px]">
              <span className="text-center px-2">Ad Space (300x300)</span>
            </div>
          </div>
          {/* Responsive Wide Ad Box (maintains ~1.91:1 aspect ratio like 600x314) */}
          <div className="bg-primary-100 flex justify-center items-center w-full max-w-[600px] aspect-[600/314] ml-auto min-h-[120px]">
            <span className="text-center px-2">Ad Space (600x314)</span>
          </div>
        </div>

      </div>

      <div className="xl:w-[520px] w-full">
        <TopStories />
      </div>
    </section>
  );
}
