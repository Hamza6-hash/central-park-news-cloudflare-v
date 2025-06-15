"use client";
import TopStories from "@/components/topStories/TopStories";
import Image, { StaticImageData } from "next/image";
import { formatedDate } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from 'react-markdown';
import { useQuery } from '@tanstack/react-query';
import { defultImage } from "@/constants";
import { fetchCombinedFeaturedItem } from "@/lib/query";
import SafeImage from "@/constants/SafeImage";


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

export default function Home() {

  const {
    data: article,
    isLoading: loading,
    error
  } = useQuery<Article>({
    queryKey: ["featuredArticle"],
    queryFn: fetchCombinedFeaturedItem,
    retry: 2,
    staleTime: 1000 * 60 * 7,
  });

  // if (loading) {
  //   return (
  //     <section className="flex gap-9 max-xl:flex-col w-full px-0 max-w-[1200px] mx-auto">
  //       <div className="xl:w-[644px] w-full max-w-full overflow-hidden">
  //         <div className="space-y-3 mb-4 px-4">
  //           <Skeleton className="h-8 w-3/4 bg-gray-100" />
  //           <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] max-w-full">
  //             <Skeleton className="h-full w-full rounded-lg bg-gray-100" />
  //           </div>
  //           <div className="flex items-center gap-2">
  //             <Skeleton className="h-4 w-4 bg-gray-100" />
  //             <Skeleton className="h-4 w-32 bg-gray-100" />
  //             <Skeleton className="h-4 w-4 bg-gray-100" />
  //             <Skeleton className="h-4 w-24 bg-gray-100" />
  //           </div>
  //         </div>
  //         <div className="px-4 space-y-4">
  //           {[1, 2, 3, 4].map((index) => (
  //             <Skeleton key={index} className="h-4 w-full bg-gray-100" />
  //           ))}
  //         </div>
  //       </div>
  //       <div className="xl:w-[520px] w-full">
  //         <TopStories />
  //       </div>
  //     </section>
  //   );
  // }

  if (loading) {
    return (
      <section className="flex gap-9 max-xl:flex-col w-full px-0 max-w-[1200px] mx-auto text-[12px] sm:text-base">
        <div className="xl:w-[644px] w-full max-w-full overflow-hidden">
          <div className="px-4 mb-4 space-y-3">
            {/* Title skeleton */}
            <Skeleton className="h-10 w-3/4 bg-gray-100" />

            {/* Image skeleton */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] max-w-full">
              <Skeleton className="h-full w-full rounded-lg bg-gray-100" />
            </div>

            {/* Meta (author + date) skeleton */}
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="h-4 w-4 bg-gray-100" />
              <Skeleton className="h-4 w-32 bg-gray-100" />
              <Skeleton className="h-4 w-4 bg-gray-100" />
              <Skeleton className="h-4 w-24 bg-gray-100" />
            </div>
          </div>

          {/* Body content placeholder */}
          <div className="px-4 space-y-4">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-4 w-full bg-gray-100" />
            ))}
          </div>

          {/* Ad section placeholder */}
          <div className="flex flex-col w-full mb-6 mt-10 sm:px-3 md:p-4 gap-4 items-end justify-end">
            <div className="flex w-full flex-col max-[360px]:items-start sm:flex-row sm:items-end justify-between gap-4">
              <Skeleton className="h-5 w-24 bg-gray-100" />
              <Skeleton className="w-full max-w-[300px] aspect-square bg-gray-100 rounded" />
            </div>
            <Skeleton className="w-full max-w-[600px] aspect-[600/314] bg-gray-100 rounded" />
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
          {/* Fixed height title container to prevent CLS */}
          <div className="min-h-[48px] flex items-start">
            <Link
              href={`/${article.type === 'newsletter' ? 'news' : 'articles'}/${article.titleSlug}`}
            >
              <h1 className="font-century-schoolbook sm:text-[12px] text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl capitalize hover:text-primary-500 transition-colors break-words max-w-full line-clamp-2">
                {article.title}
              </h1>
            </Link>
          </div>

          {/* Fixed aspect ratio container with placeholder to prevent CLS */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/10] lg:aspect-[1.6/1] max-w-full protected-image-container">
            {/* Background placeholder */}
            <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg"></div>

            <SafeImage
              src={article.imageURL || defultImage}
              alt={article.title}
              fill
              quality={75}
              loading="eager"
              priority={true}
              className="object-cover protected-image relative z-10 rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 644px, 644px"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQ0IiBoZWlnaHQ9IjQzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+"
            />
          </div>

          {/* Fixed height meta container to prevent CLS */}
          <div className="min-h-[24px] flex items-center text-[12px] sm:text-xs md:text-sm lg:text-base gap-2 flex-wrap">
            <hr className="w-4 sm:w-6 h-1" />
            <h6 className="capitalize font-montserrat text-[12px] sm:text-xs md:text-sm lg:text-base">
              {article.authorName}
            </h6>
            <span className="text-primary-500">|</span>
            <p className="text-primary-500 italic font-montserrat text-[12px] sm:text-xs md:text-sm lg:text-base">
              {article.createdAt ? formatedDate(article.createdAt) : "N/A"}
            </p>
          </div>
        </div>

        {/* Content with reserved space */}
        <div className="markdown-content min-h-[200px]">
          <ReactMarkdown>{article?.content}</ReactMarkdown>
        </div>

        {/* Fixed height ad section to prevent CLS */}
        <div className="flex flex-col w-full mb-6 mt-10 sm:px-3 md:p-4 gap-4 items-end justify-end">
          {/* Top Row: Share Title + Square Ad */}
          <div className="flex w-full flex-col max-[360px]:items-start sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col min-h-[40px]">
              <p className="font-bold mb-2">Share This:</p>
            </div>
            {/* Fixed aspect ratio square ad */}
            <div className="w-full max-w-[300px] aspect-square bg-primary-100 flex items-center justify-center shrink-0 min-w-[150px] rounded">
              <span className="text-center px-2">Ad Space (300x300)</span>
            </div>
          </div>

          {/* Fixed aspect ratio wide ad */}
          <div className="bg-primary-100 flex justify-center items-center w-full max-w-[600px] aspect-[600/314] ml-auto min-h-[120px] rounded">
            <span className="text-center px-2">Ad Space (600x314)</span>
          </div>
        </div>

      </div>

      <div className="xl:w-[520px] w-full">
        <TopStories />
      </div>
    </section>
  );

  // return (
  //   <section className="flex gap-9 max-xl:flex-col w-full max-w-[1200px] mx-auto text-[12px] sm:text-base">
  //     <div className="xl:w-[644px] w-full max-w-full overflow-hidden">

  //       <hr className={`w-64 h-0.5 mb-2 bg-gray-200`} />
  //       <div className="space-y-3 mb-4">
  //         <Link
  //           href={`/${article.type === 'newsletter' ? 'news' : 'articles'}/${article.titleSlug
  //             }`}
  //         >
  //           <h1 className="min-h-[48px] font-century-schoolbook sm:text-[12px] text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl capitalize hover:text-primary-500 transition-colors break-words max-w-full line-clamp-2">
  //             {article.title}
  //           </h1>
  //         </Link>

  //         <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/10] lg:aspect-[1.6/1] max-w-full protected-image-container">
  //           <SafeImage
  //             src={article.imageURL || defultImage}
  //             alt={article.title}
  //             fill
  //             quality={75}
  //             loading="eager"
  //             priority={true}
  //             className="object-cover protected-image"
  //             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 644px, 644px"
  //           />

  //         </div>
  //         <div className="flex items-center text-[12px] sm:text-xs md:text-sm lg:text-base gap-2 flex-wrap">
  //           <hr className="w-4 sm:w-6 h-1" />
  //           <h6 className="capitalize font-montserrat text-[12px] sm:text-xs md:text-sm lg:text-base">
  //             {article.authorName}
  //           </h6>
  //           <span className="text-primary-500">|</span>
  //           <p className="text-primary-500 italic font-montserrat text-[12px] sm:text-xs md:text-sm lg:text-base">
  //             {article.createdAt
  //               ? formatedDate(article.createdAt) : "N/A"}
  //           </p>
  //         </div>
  //       </div>

  //       <div className="markdown-content  ">
  //         <ReactMarkdown>{article?.content}</ReactMarkdown>
  //       </div>

  //       {/* -------------- 600x600 ad bar -------------------- */}
  //       <div className="flex flex-col w-full mb-6 mt-10 sm:px-3 md:p-4 gap-4 items-end justify-end">
  //         {/* Top Row: Share Title + Square Ad */}
  //         <div className="flex w-full flex-col max-[360px]:items-start sm:flex-row sm:items-end justify-between gap-4">
  //           <div className="flex flex-col">
  //             <p className="font-bold mb-2">Share This:</p>
  //           </div>
  //           {/* Responsive Square Ad Box (maintains 1:1 aspect ratio) */}
  //           <div className="w-full max-w-[300px] aspect-square bg-primary-100 flex items-center justify-center shrink-0 min-w-[150px]">
  //             <span className="text-center px-2">Ad Space (300x300)</span>
  //           </div>
  //         </div>
  //         {/* Responsive Wide Ad Box (maintains ~1.91:1 aspect ratio like 600x314) */}
  //         <div className="bg-primary-100 flex justify-center items-center w-full max-w-[600px] aspect-[600/314] ml-auto min-h-[120px]">
  //           <span className="text-center px-2">Ad Space (600x314)</span>
  //         </div>
  //       </div>

  //     </div>

  //     <div className="xl:w-[520px] w-full">
  //       <TopStories />
  //     </div>
  //   </section>
  // );
}
