import React from "react";
import { format } from "date-fns/format";
import { FetchTopStories } from "@/lib/query";
import Adbox from "../Ads/Adbox";
import HorizontalCard from "../common/HorizontalCard";

interface Newsletter {
  id: string;
  title?: string;
  content?: string;
  authorId?: string;
  authorName?: string;
  imageURL?: string;
  titleSlug?: string;
  status?: string;
  createdAt?: string;
  category?: string;
}

interface TopStoriesProps {
  showViewMore?: boolean;
  isContactPage?: boolean;
}

const TopStories = async ({ showViewMore = false, isContactPage = false }: TopStoriesProps) => {

  const newsletters: Newsletter[] = await FetchTopStories();

  if (!newsletters || newsletters.length === 0) {
    return (
      <div className="">
        <h2 className="font-bold text-2xl mb-4 font-century-gothic">
          TOP <span className="text-primary-500">STORIES</span>
        </h2>
        <div>
          No top stories available.
        </div>
      </div>
    );
  }


  const displayedNewsletters = newsletters;

  return (
    <div className="">
      <h2 className="font-poppins font-bold text-[32px] mb-4 uppercase tracking-normal">
        TOP <span className="text-[#E4212B]">{newsletters?.length}</span> STORIES
      </h2>
      <div className="flex flex-col xl:gap-5 sm:gap-7 gap-8">
        {displayedNewsletters?.map((newsletter: Newsletter) => {
          const formattedDate = newsletter.createdAt
            ? format(new Date(newsletter.createdAt), "MMM d, yyyy")
            : "";


          return (
            <React.Fragment key={newsletter.id}>
              <HorizontalCard
                title={newsletter.title || "-"}
                category={newsletter.category}
                imageURL={newsletter.imageURL || "/CN-Default.png"}
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
