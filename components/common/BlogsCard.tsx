"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";
import DummyImg from "@/assets/Rectangle-4.png";
import Link from "next/link";
import { routes } from "@/constants";
import TruncateText from "./TruncateProps";

interface BlogsCard {
  showDateTimeInRow?: boolean;
  title: string;
  content: string;
  imageURL?: string | StaticImageData;
  authorName?: string;
  publishDate: {
    seconds: number;
    nanoseconds: number;
  };
  titleSlug?: string;
  type?: "article" | "news";
}

const BlogsCard = ({
  showDateTimeInRow = false,
  title,
  content,
  imageURL = DummyImg,
  authorName = "Docket Digest New Room",
  publishDate,
  titleSlug = "",
  type = "article",
}: BlogsCard) => {
  const formattedDate = new Date(publishDate.seconds * 1000).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const getLinkPath = () => {
    if (type === "news") {
      return `${routes.news}/${titleSlug}`;
    }
    return `${routes.articles}/${titleSlug}`;
  };

  return (
    <div className="bg-[#67B6DF24] relative w-full sm:max-w-[337px] h-[465px] rounded-[6px] p-6 flex flex-col">
      {/* Image Container - Fixed position */}
      <div className="relative w-full h-[189px]  overflow-hidden">
        <Image src={imageURL} alt={title} fill className="object-cover" />
      </div>

      {/* Title - Fixed position */}
      <div className="mt-3 h-[52px]">
        <h1 className="font-century-schoolbook font-bold text-[24px] leading-[29px] line-clamp-2">
          {title}
        </h1>
      </div>

      {/* Author and Date - Fixed position */}
      <div className="mt-3 h-[14px]">
        <div className="flex items-center gap-1.5">
          <hr className="min-w-[16px] sm:min-w-[20px] h-1 shrink-0" />
          <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
            <h6 className="text-dark-400 capitalize font-font-century-725-cn font-normal text-[12px] leading-[14px] ">
              {authorName}
            </h6>
            <span className="shrink-0 text-[12px] leading-[14px]">|</span>
            <h6 className="text-[12px] leading-[14px] text-dark-400 capitalize  font-font-century-725-cn font-normal">
              {formattedDate}
            </h6>
          </div>
        </div>
      </div>

      {/* Content - Fixed position */}
      <div className="mt-4 h-[60px]">
        <div className="text-[#000] text-ellipsis line-clamp-3 font-century-gothic text-[15px] font-normal capitalize">
          <TruncateText lines={3} content={content} />
        </div>
      </div>

      {/* View More Link - Fixed position */}
      <div className="absolute bottom-[36px] right-6">
        <Link href={getLinkPath()}>
          {/* <p className="text-primary-900 font-century-gothic font-bold text-[14px] leading-[14px] tracking-[0.06em] uppercase transition-colors duration-300 hover:text-yellow-500"> */}
          <p className="text-[#2B4864] text-right font-century-gothic text-[14px] font-bold text-sm leading-[100%] tracking-[0%] capitalize">
            VIEW MORE
          </p>
        </Link>
      </div>
    </div>
  );
};

export default BlogsCard;
