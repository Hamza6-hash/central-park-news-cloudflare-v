"use client";
import { StaticImageData } from "next/image";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import NewsSingleLoading from "@/components/Loadings/NewsSingleLoading";
import dynamic from "next/dynamic";


const DynamicBlog = dynamic(() => import("@/components/common/DynamicBlog"), {
  loading: () => <NewsSingleLoading />,

});


export interface News {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  authorId: string;
  excerpt: string;
  socialImageUrls: any;
  tags: string[];
  category: string;
  publishDate: string;
  updatedAt: string;
  authorName?: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
  formattedDate?: string;
  titleSlug?: string;
  authorPosition?: string;
  createdAt: string,
  status: string,
  position: string,
  citation?: string,
}

const NewsClient = ({ slug, data, relatedNews }: { slug: string, data: News, relatedNews: News[] }) => {
  const { data: news, isLoading } = useQuery({
    queryKey: ['fetchSingleNews', slug],
    queryFn: async () => {
      const response = await fetch(`/api/article/${slug}?type=news`);
      if (!response.ok) throw new Error('Failed to fetch news');
      return response.json();
    },
    retry: 2,
    staleTime: 1000 * 60 * 7,
    initialData: data,
    enabled: !!slug,
  })

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
          <h1 className="text-[12px] sm:text-lg font-century-gothic text-black capitalize flex flex-wrap items-center gap-[16px]">
            <span className="cursor-pointer">
              <Link href={'/news'}>
                News
              </Link>
            </span>
            <span className="text-[#1E3D5A]">/</span>
            <span className="text-sm font-bold text-[#1E3D5A] flex items-center gap-1 flex-wrap">
              {news.title}
            </span>
          </h1>
        </div>
      </div>
      <DynamicBlog
        title={news.title}
        category={news?.category}
        imageURL={news.imageURL || "/main.webp"}
        authorName={news.authorName || "Central Park News"}
        authorPosition={news.authorPosition || "Newstrix"}
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
