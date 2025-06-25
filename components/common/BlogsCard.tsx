"use client";

import { StaticImageData } from "next/image";
import Link from "next/link";
import { defultImage, routes } from "@/constants";
import TruncateText from "./TruncateProps";
import SafeImage from "@/constants/SafeImage";
import { Calendar, Zap } from "lucide-react";
import removeMarkdown from "remove-markdown";

interface BlogsCard {
  showDateTimeInRow?: boolean;
  title: string;
  content: string;
  imageURL?: string | StaticImageData;
  authorName?: string;
  publishDate?: string;
  titleSlug?: string;
  type?: "article" | "news";
  suggestedBlog?: boolean;
  createdAt?: string;
  category_name?: string,
  showTrending?: boolean,
  isFeatured?:boolean 
}

const BlogsCard = ({
  showDateTimeInRow = false,
  title,
  content,
  imageURL,
  authorName = "Docket Digest New Room",
  titleSlug = "",
  type = "article",
  category_name,
  createdAt,
  showTrending = true,
  isFeatured =  false,
}: BlogsCard) => {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

  const getLinkPath = () => {
    if (type === "news") {
      return `${routes.news}/${titleSlug}`;
    }
    return `${routes.articles}/${titleSlug}`;
  };

  return (
    <Link href={getLinkPath()}>
      <div className="w-full max-w-[381px] mx-auto cursor-pointer group">
        <div className="bg-[#67B6DF24] rounded-lg overflow-hidden shadow-sm  duration-300 ease-in-out group-hover:shadow-lg group-hover:scale-[1.02]">

          <div className="relative w-full h-[200px] overflow-hidden">
            {isFeatured && (
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-[#FFD910] text-[#7D6901] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Trending
                </span>
              </div>
            )}

            <SafeImage
              src={imageURL || defultImage}
              alt={title}
              fill
              loading="eager"
              priority
              className="object-cover pointer-events-none select-none "
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="p-6 transition-colors duration-300 ease-in-out ">
            <div className="mb-3">
              <span className="bg-[#FFEB84] font-montserrat text-[#7D6901] text-xs font-medium px-3 py-1 rounded-full capitalize">
                {category_name}
              </span>
            </div>

            <h2 className="text-[#1a2332] font-century-schoolbook md:text-[24px] text-[16px] font-bold md:leading-7 leading-5 mb-3 md:line-clamp-2 line-clamp-3">
              {title}
            </h2>

            <div className="text-black font-century-gothic md:text-[15px] text-[12px] mb-4 line-clamp-3">
              <TruncateText lines={3} content={removeMarkdown(content)} />
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <div className="flex gap-3 items-center">
                <Calendar size={12} color="#020617" />
                <span className="text-[#808080] transition-colors duration-300 ease-in-out ">{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogsCard;
