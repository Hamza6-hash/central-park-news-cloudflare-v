"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FetchTopStories } from "@/lib/query";
import HorizontalCard from "@/components/common/HorizontalCard";
import Adbox from "@/components/Ads/Adbox";
import { format } from "date-fns";

interface Newsletter {
  id: string;
  title?: string;
  content?: string;
  authorName?: string;
  imageURL?: string;
  titleSlug?: string;
  category?: string;
  createdAt?: string;
}

interface TopStoriesClientProps {
  initialData: Newsletter[];
}

const TopStoriesClient = ({ initialData }: TopStoriesClientProps) => {
  const { data: newsletters = [] } = useQuery({
    queryKey: ["topStories"],
    queryFn: FetchTopStories,
    initialData,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  if (!newsletters.length) return <div>No top stories available.</div>;

  return (
    <div className="flex flex-col xl:gap-5 sm:gap-7 gap-8">
      {newsletters.map((newsletter) => {
        const formattedDate = newsletter.createdAt
          ? format(new Date(newsletter.createdAt), "MMM d, yyyy")
          : "";

        return (
          <HorizontalCard
            key={newsletter.id}
            title={newsletter.title || "-"}
            category={newsletter.category || "Local News"}
            imageURL={newsletter.imageURL || "/Cbnews-default.png"}
            authorName={newsletter.authorName || "Docket Digest New Room"}
            publishDate={formattedDate}
            content={newsletter.content || "-"}
            titleSlug={newsletter.titleSlug}
            type="news"
          />
        );
      })}
      <Adbox />
    </div>
  );
};

export default TopStoriesClient;