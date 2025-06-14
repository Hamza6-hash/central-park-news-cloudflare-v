"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { defultImage, routes } from "@/constants";
import TruncateText from "./TruncateProps";
import SafeImage from "@/constants/SafeImage";

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
  createdAt
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
    <div
      className="bg-[#67B6DF24] relative w-full sm:max-w-[337px] h-[465px] rounded-[6px] p-6 flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full h-[189px] overflow-hidden">
        <SafeImage
          src={imageURL || defultImage}
          alt={title}
          fill
          loading="eager"
          priority
          className="object-cover pointer-events-none select-none"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Title */}
      <div className="mt-3 h-[52px]">
        <h1 className="font-century-schoolbook font-bold text-[24px] leading-[29px] line-clamp-2">
          {title}
        </h1>
      </div>

      {/* Author and Date */}
      <div className="mt-3 h-[14px]">
        {showDateTimeInRow ? (
          <div className="flex items-center gap-1.5">
            <hr className="min-w-[16px] sm:min-w-[20px] h-1 shrink-0" />
            <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
              <h6 className="text-dark-400 capitalize font-font-century-725-cn font-normal text-[12px] leading-[14px]">
                {authorName}
              </h6>
              <span className="shrink-0 text-[12px] leading-[14px]">|</span>
              <h6 className="text-[12px] leading-[14px] text-dark-400 capitalize font-font-century-725-cn font-normal">
                {formattedDate}
              </h6>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <hr className="w-6 h-0.5 text-dark-900" />
            <div>
              <h6 className="text-dark-400 capitalize font-montserrat font-normal text-[16px] leading-[14px] mb-1">
                {authorName}
              </h6>
              <h6 className="text-[14px] leading-[16px] text-dark-400 capitalize font-montserrat font-normal">
                {formattedDate}
              </h6>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 h-[60px]">
        <div className="text-[#000] text-ellipsis line-clamp-3 text-[15px] font-normal capitalize font-century-gothic">
          <TruncateText lines={3} content={content} />
        </div>
      </div>

      {/* View More */}
      <div className="absolute bottom-[24px] right-0 w-full px-6">
        <div className="flex justify-between items-center">
          <h1 className="bg-[#FFEB84] text-black text-xs truncate w-fit max-w-[60%]  capitalize font-montserrat py-1 px-2 rounded-full">
            {category_name}
          </h1>

          <Link href={getLinkPath()}>
            <p className="text-[#2B4864] font-century-gothic text-[14px] font-bold leading-[100%] capitalize transition-colors duration-300 hover:text-white">
              VIEW MORE
            </p>
          </Link>
        </div>
      </div>
    </div>

  );
};

export default BlogsCard;
