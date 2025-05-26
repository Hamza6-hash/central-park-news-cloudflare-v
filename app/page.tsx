"use client";
import TopStories from "@/components/topStories/TopStories";
import Image, { StaticImageData } from "next/image";
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
  orderBy
} from "firebase/firestore";
import { formatedDate } from "@/lib/utils";
import Link from "next/link";
import { generateSlug } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { fireServices } from "./services/firestoreService";
import ReactMarkdown from 'react-markdown';


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
  createdAt: string
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
  console.log(article)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();


  // const fetchArticle = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     if (!db) {
  //       throw new Error("Database connection is not available");
  //     }

  //     const articlesRef = collection(db, "blog/blockchainBriefing/articles");
  //     const articlesQuery = query(
  //       articlesRef,
  //       where("status", "==", "published")
  //     );
  //     const articlesSnapshot = await getDocs(articlesQuery);

  //     if (articlesSnapshot.empty) {
  //       setError("No articles available at the moment.");
  //       setLoading(false);
  //       return;
  //     }

  //     // Sort articles by publish date
  //     const articles = articlesSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     })) as Article[];

  //     articles.sort((a, b) => {
  //       const dateA = new Date(a.createdAt).getTime();
  //       const dateB = new Date(b.createdAt).getTime();
  //       return dateB - dateA;
  //     });

  //     const firstArticle = articles[0];

  //     const authorDoc = await getDoc(
  //       doc(db, "blog/blockchainBriefing/authors", firstArticle.authorId)
  //     );
  //     const authorName = authorDoc.exists()
  //       ? authorDoc.data().author_name
  //       : "Unknown Author";

  //     let formattedDate = "Unknown Date";

  //     if (firstArticle.createdAt) {
  //       try {
  //         const date = new Date(firstArticle.createdAt);

  //         formattedDate = date.toLocaleDateString("en-US", {
  //           year: "numeric",
  //           month: "long",
  //           day: "numeric",
  //         });
  //       } catch (error) {
  //         console.error("Error formatting date:", error);
  //       }
  //     }


  //     setArticle({
  //       ...firstArticle,
  //       authorName: authorName,
  //       date: formattedDate,
  //     });
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching article:", error);
  //     setError("Failed to load article. Please try again later.");
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const fetchCombinedFeaturedItem = async () => {
      try {
        setLoading(true);
        setError(null);

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
          const dateA = new Date(a.updatedAt).getTime();
          const dateB = new Date(b.updatedAt).getTime();
          return dateB - dateA;
        });

        // Find the latest featured item
        const latestFeatured = combined.find(item => item.isFeatured === true);
        setArticle(latestFeatured || null);
      } catch (error) {
        console.error("Error fetching combined featured item:", error);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedFeaturedItem();
  }, []);




  useEffect(() => {

    // fetchArticle();
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
    <section className="flex gap-9 max-xl:flex-col w-full px-0 max-w-[1200px] mx-auto text-[12px] sm:text-base">
      <div className="xl:w-[644px] w-full max-w-full overflow-hidden">
        <div className="space-y-3 mb-4 px-4">
          <Link
            href={`/articles/${article.titleSlug
              }`}
          >
            <h1 className="font-century-schoolbook sm:text-[12px] text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl capitalize hover:text-primary-500 transition-colors break-words max-w-full line-clamp-2">
              {article.title}
            </h1>
          </Link>

          <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] max-w-full">
            <Image
              src={article.imageURL || DummyImage}
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
              {article.createdAt
                ? formatedDate(article.createdAt) : "N/A"}
            </p>
          </div>
        </div>

        <div className="markdown-content ">
          <ReactMarkdown>{article?.content}</ReactMarkdown>
        </div>

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
            <span>Ad Space (300x300)</span>
          </div>

        </div>

        {/* Responsive 600x314 Ad */}
        <div className="w-full aspect-[1.91] bg-primary-100 flex justify-center items-center">
          <span>Ad Space 600x314</span>
        </div>


      </div>

      <div className="xl:w-[520px] w-full">
        <TopStories />
      </div>
    </section>
  );
}
