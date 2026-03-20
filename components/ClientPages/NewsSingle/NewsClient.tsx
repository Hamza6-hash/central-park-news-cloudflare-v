"use client";
import { StaticImageData } from "next/image";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import NewsSingleLoading from "@/components/Loadings/NewsSingleLoading";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import type { NewsSingleArticle, RelatedNewsItem } from "@/types/article";

/** @deprecated Prefer importing NewsSingleArticle from @/types/article */
export type News = NewsSingleArticle;

const DynamicBlog = dynamic(() => import("@/components/common/DynamicBlog"), {
  loading: () => <NewsSingleLoading />,
  ssr: false, // Avoid hydration mismatch: server and client both show loading, then client mounts content
});

const NewsClient = ({
  slug,
  data,
  relatedNews,
}: {
  slug: string;
  data: NewsSingleArticle;
  relatedNews: RelatedNewsItem[];
}) => {
  const { data: news, isLoading } = useQuery({
    queryKey: ['fetchSingleNews', slug],
    queryFn: async () => {
      const response = await fetch(`/api/article/${slug}?type=news`);
      if (!response.ok) throw new Error('Failed to fetch news');
      return response.json();
    },
    retry: (failureCount, error) => {
      if (error instanceof Error && error.name === 'AbortError') return false;
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 7,
    initialData: data,
    enabled: !!slug,
  })

  useEffect(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.twttr?.widgets) {
      // @ts-ignore
      window.twttr.widgets.load();
    }
  }, [news]);


  if (isLoading) {
    return (
      <NewsSingleLoading />
    );
  }


  if (!news) {
    return null;
  }




  return (
    <div className="w-full ">
      <div className="w-full">
        <div className="w-full sm:w-[537px] h-[2px] bg-[#252525]"></div>
        <div className="flex flex-col gap-4 mt-2 mb-4 ">
          <nav className="text-[12px] sm:text-lg font-century-gothic text-black capitalize flex flex-wrap items-center gap-[16px]">
            <span className="cursor-pointer">
              <Link href={'/news'}>
                News
              </Link>
            </span>
            <span className="text-[#1E3D5A]">/</span>
            <span className="text-sm font-bold text-[#1E3D5A] flex items-center gap-1 flex-wrap">
              {news.title}
            </span>
          </nav>
        </div>
      </div>
      <DynamicBlog
        title={news.title}
        category={news?.category}
        imageURL={news.imageURL || "/main.webp"}
        authorName={news.authorName || "Sarah Lee"}
        authorPosition={news.authorPosition || "Central Park News"}
        publishDate={news.createdAt}
        content={news.content}
        titleSlug={news.titleSlug}
        isArticlePage={false}
        mainHeading="News"
        relatedNews={relatedNews}
      />
    </div>
  );
};

export default NewsClient;
