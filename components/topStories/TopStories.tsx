import React from "react";
import HorizontalCard from "../common/HorizontalCard";
import { useQuery } from "@tanstack/react-query";
import DummyImg from "@/assets/Blockchain-Default.webp";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns/format";
import { FetchTopStories } from "@/lib/query";
import Adbox from "../Ads/Adbox";

interface Newsletter {
  id: string;
  title?: string;
  content?: string;
  authorId?: string;
  authorName?: string;
  imageURL?: string;
  titleSlug?: string;
  status: string,
  createdAt?: string,
  isFeatured: boolean,
  updatedAt: string,
  type?: string;
  category?: string,
  imageName?:string,
}



const TopStories = () => {

  const {
    data: newsletters,
    error,
    isLoading,
  } = useQuery<Newsletter[]>({
    queryKey: ["getAllNewsletters"],
    queryFn: FetchTopStories
  })

  if (error) {
    return (
      <div className="px-sm-generic">
        <h2 className="font-bold text-2xl mb-4 font-monserrat">
          TOP <span className="text-[#26619C]">STORIES</span>
        </h2>
        <div className="text-red-500">
          Error loading newsletters. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-sm-generic">
        <h2 className="font-bold text-2xl mb-4 flex gap-2">
          <Skeleton className="h-6 w-[60px] bg-gray-100" />
          <Skeleton className="h-6 w-[90px] bg-gray-100" />
        </h2>
        <div className="flex flex-col xl:gap-5 sm:gap-7 gap-8">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex gap-4 w-full">
              <Skeleton className="h-[100px] w-[100px] rounded-lg bg-gray-100" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-3/4 bg-gray-100" />
                <Skeleton className="h-4 w-1/2 bg-gray-100" />
                <Skeleton className="h-4 w-1/4 bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayedNewsletters = newsletters;

  return (
    <div className="px-sm-generic">
      <h2 className="font-bold text-2xl mb-4 font-century-gothic">
        <span className="mr-2">TOP</span>
        <span className="text-[#26619C]">STORIES</span>
      </h2>

      <div className="flex flex-col xl:gap-5 sm:gap-7 gap-8">
        {displayedNewsletters?.slice(0, 7).map((newsletter: Newsletter) => {
          const formattedDate = newsletter.createdAt
            ? format(new Date(newsletter.createdAt), "MMM d, yyyy")
            : "";

          return (
            <React.Fragment key={newsletter.id}>
              <HorizontalCard
                title={newsletter.title || "-"}
                imageURL={newsletter.imageURL || DummyImg}
                imageName={newsletter.imageName || 'No Name'}
                authorName={newsletter.authorName || "Docket Digest New Room"}
                publishDate={formattedDate}
                content={newsletter.content || "-"}
                titleSlug={newsletter.titleSlug}
                type={newsletter.type}
                category_name={newsletter.category}
              />
            </React.Fragment>
          );
        })}
      </div>

      <Adbox/>

    </div>
  );
};

export default TopStories;
