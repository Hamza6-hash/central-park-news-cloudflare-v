"use client";
import DynamicBlog from "@/components/common/DynamicBlog";
import { Skeleton } from "@/components/ui/skeleton";
import user from '/assets/user.png'
import { StaticImageData } from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchNewsBySlug } from "@/lib/query";
import Link from "next/link";

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
  authorImage: string | StaticImageData;
  createdAt: string,
  status: string,
  position: string,
  citation?: string,
}

const NewsClient = ({ slug, data, relatedNews }: { slug: string, data: News, relatedNews: News[] }) => {
  const { data: news, isLoading } = useQuery({
    queryKey: ['fetchSingleNews', slug],
    queryFn: () => fetchNewsBySlug(slug),
    retry: 2,
    staleTime: 1000 * 60 * 7,
    initialData: data,
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center max-md:justify-center max-md:flex-col gap-2">
          <Skeleton className="h-8 w-32 bg-gray-100 sm:w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 bg-gray-100 rounded-full" />
            <Skeleton className="h-6 w-48 bg-gray-100 sm:w-32" />
          </div>
        </div>

        <div className="mt-14">
          <div className="space-y-3 mb-4">
            <div className="w-full">
              <Skeleton className="h-8 w-3/4 bg-gray-100 sm:w-1/2 lg:w-1/3" />
            </div>
            <div className="relative w-[90vw] max-w-[1200px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] overflow-hidden rounded-lg mx-auto">
              <Skeleton className="w-full h-full bg-gray-100 object-cover" />
            </div>
            <div className="flex items-center sm:text-lg text-sm gap-2 flex-wrap">
              <Skeleton className="h-4 w-32 bg-gray-100 sm:w-24" />
              <Skeleton className="h-4 w-4 bg-gray-100 sm:w-3" />
              <Skeleton className="h-4 w-24 bg-gray-100 sm:w-20" />
            </div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <Skeleton
                key={index}
                // className="h-4 w-full bg-gray-100 sm:w-[90%] md:w-[80%] lg:w-[70%]"
                className="h-4 w-full bg-gray-100 sm:w-[100%] md:w-[100%] lg:w-[100%]"
              />
            ))}
          </div>

          <div className="my-8 flex w-full sm:flex-row flex-col gap-4 sm:justify-between sm:items-center justify-center">
            {/* Written By Skeleton */}
            <div className="flex gap-2 flex-col max-sm:justify-center max-sm:items-center">
              <Skeleton className="h-6 w-24 bg-gray-100" />
              <div className="w-12 h-12 relative rounded-full overflow-hidden">
                <Skeleton className="w-full h-full bg-gray-100" />
              </div>
              <Skeleton className="h-4 w-32 bg-gray-100 sm:w-24" />
              <Skeleton className="h-4 w-48 bg-gray-100 sm:w-32" />
            </div>

            {/* Social Media Skeleton */}
            <div className="flex items-center gap-3 sm:justify-between sm:items-center justify-center">
              {[1, 2].map((index) => (
                <Skeleton
                  key={index}
                  className="h-8 w-8 bg-gray-100 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
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
        authorImg={news.authorImage || user}
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
