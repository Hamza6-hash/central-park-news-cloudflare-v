import React from "react";
import { format } from "date-fns/format";
import { StaticImageData } from "next/image";
import Adbox from "../Ads/Adbox";
import HorizontalCard from "../common/HorizontalCard";

interface TopStory {
  id: string;
  title?: string;
  content?: string;
  authorId?: string;
  authorName?: string;
  imageURL?: string | StaticImageData;
  titleSlug?: string;
  mobileURL?: string;
  status?: string;
  createdAt?: Date | string;
  category?: string;
}

interface TopStoriesProps {
  topStories?: TopStory[];
}

const TopStories = ({ topStories = [] }: TopStoriesProps) => {
  const newsletters = topStories;

  if (!newsletters || newsletters.length === 0) {
    return (
      <div className="">
        <h2 className="font-bold text-2xl mb-4 font-century-gothic">
          TOP <span className="text-primary-500">STORIES</span>
        </h2>
        <div>No top stories available.</div>
      </div>
    );
  }

  return (
    <div className="sm:mt-5">
      <h2 className="font-poppins font-bold text-[32px] mb-4 uppercase tracking-normal">
        TOP <span className="text-[#E4212B]">7</span> STORIES
      </h2>
      <div className="flex flex-col xl:gap-5 sm:gap-7 gap-8 md:mt-[7rem]">
        {newsletters.map((newsletter: TopStory) => {
          const formattedDate = newsletter.createdAt
            ? format(new Date(newsletter.createdAt), "MMM d, yyyy")
            : "";

          return (
            <React.Fragment key={newsletter.id}>
              <HorizontalCard
                title={newsletter.title || "-"}
                category={newsletter.category || "Local News"}
                imageURL={newsletter.imageURL || "/thumbnail.webp"}
                mobileURL={newsletter.mobileURL || "/thumbnail.webp"}
                authorName={newsletter.authorName || "Docket Digest New Room"}
                publishDate={formattedDate}
                content={newsletter.content || "-"}
                titleSlug={newsletter.titleSlug}
                type="news"
              />
            </React.Fragment>
          );
        })}
      </div>

      <Adbox />
    </div>
  );
};

export default TopStories;
