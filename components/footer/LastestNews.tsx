"use client";

import React from "react";
import VerticalCard from "../common/VerticalCard";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { defultImage } from "@/constants";
import { FetchLatestNews } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const LastestNews = () => {
  const pathname = usePathname();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const {
    data: articles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["latestNews", pathname],
    queryFn: FetchLatestNews,
    retry: 2,
    staleTime: 1000 * 60 * 7,
  });

  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (isLoading) {
    return (
      <section className="lastestNews py-[58px] px-generic">
        <div className="max-width w-full">
          <h1 className="uppercase text-3xl font-bold text-white mb-4">LATEST NEWS</h1>
          <div className="flex gap-6 items-center justify-between relative w-full mx-auto">
            <div className="w-full flex gap-4 overflow-x-scroll hide-scrollbar mx-auto py-1">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="min-w-[214px] flex-shrink-0">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-[160px] w-full rounded-lg bg-gray-100" />
                    <Skeleton className="h-4 w-3/4 bg-gray-100" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-20 bg-gray-100" />
                      <Skeleton className="h-3 w-3 bg-gray-100" />
                      <Skeleton className="h-3 w-16 bg-gray-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="py-[58px] px-generic text-center text-red-500">
        Failed To Fetch
      </div>
    );
  }

  if (!articles?.length) return null;

  return (
    <section className="lastestNews py-[58px] px-8">
      <div className="max-width w-full">
        <h1 className="uppercase text-3xl font-bold text-white mb-4">LATEST NEWS</h1>

        <div className="relative px-4">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: false,
            }}
          >
            <CarouselContent className="-ml-3">
              {articles.slice(0, 12).map((article, index) => (
                <CarouselItem
                  key={index}
                  className="pl-3 basis-[252px] flex-shrink-0"
                >
                  <Card className="bg-[#111] text-white border-none shadow-none h-full">
                    <CardContent className="p-0">
                      <VerticalCard
                        title={article.title}
                        imageURL={article.imageURL || defultImage}
                        authorName={article.authorName || "Unknown Author"}
                        publishDate={article.publishDate}
                        titleSlug={article.titleSlug}
                        type={article.type}
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute text-black border-black -left-10 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute text-black border-black -right-10 top-1/2 -translate-y-1/2 z-10" />
            
            {/* Active Pagination Dots */}
            <div className="flex justify-center mt-6 gap-2">
              {articles.slice(0, 12).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    current === index ? "bg-white" : "bg-gray-500"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default LastestNews;