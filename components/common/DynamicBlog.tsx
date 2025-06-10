'use client';

import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { formatedDate } from "@/lib/utils";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { defultImage } from "@/constants";

interface DynamicBlogProps {
  title: string;
  imageURL: string | StaticImageData;
  authorName: string;
  publishDate: any;
  content: string;
  showWritter?: boolean;
  mainHeading?: string;
  articleId?: string;
  titleSlug?: string;
  isArticlePage?: boolean;
  authorPosition?: string;
  // @ts-ignore
  authorImg?: string | StaticImageData;
}

interface SocialMedia {
  icon: React.ReactNode;
  link: string;
}

const SocialMediaTag = ({ icon, link }: SocialMedia) => {
  return (
    <div className="rounded-full border border-primary-900 w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-primary-900 hover:border-primary-900 transition-colors group">
      {icon}
    </div>
  );
};

const socialMediaArray = [
  {
    icon: (
      <FaTwitter
        className="text-primary-900 group-hover:text-white transition-colors"
        size={15}
      />
    ),
    link: "",
  },
  {
    icon: (
      <FaFacebookSquare
        className="text-primary-900 group-hover:text-white transition-colors"
        size={15}
      />
    ),
    link: "",
  },
];

const DynamicBlog: React.FC<DynamicBlogProps> = ({
  title,
  imageURL,
  authorName,
  publishDate,
  content,
  showWritter = true,
  mainHeading = "Blog",
  articleId,
  titleSlug,
  isArticlePage = false,
  authorPosition,
  authorImg
}) => {
  const formatedPublishDate = formatedDate(publishDate, "MMMM dd, yyyy");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <section className="pt-0">

      <div className="mt-1">
        <div className="space-y-3 mb-4">
          <div className="sm:x-sm-generic ">
            {isArticlePage ? (
              <h1 className="font-century-schoolbook text-3xl capitalize">
                {title}
              </h1>
            ) : (
              <h1 className="font-century-schoolbook text-3xl capitalize">
                {title}
              </h1>
            )}
          </div>

          <div className="relative w-full max-w-[1200px] h-[514px]">
            <Image
              src={imageURL || defultImage}
              alt={title}
              width={1200}
              height={514}
              quality={100}
              loading="eager"
              priority
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            />
          </div>

          <div className="flex items-center sm:text-lg text-sm px-sm-generic gap-2 max-[400px]:flex-col max-[400px]:justify-start max-[400px]:items-start">
            <div className="flex items-center gap-2">
              <hr className="w-6 h-1 " />
              <h6 className="capitalize text-nowrap font-montserrat">
                {authorName}
              </h6>
              <span className="text-primary-500 ">|</span>
            </div>
            <p className="text-primary-500 text-nowrap ">
              {formatedPublishDate && formatedPublishDate}
            </p>
          </div>
        </div>

        <div className="markdown-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        <div className="my-8 flex w-full sm:flex-row flex-col gap-4 sm:justify-between">
          {showWritter === true && (
            <div className="flex gap-2 flex-col max-sm:justify-center ">
              <h4 className="text-lg">Written By:</h4>
              <div className="font-century-gothic text-lg">
                <p>{authorName ? authorName.charAt(0).toUpperCase() + authorName.slice(1) : 'Unknown Author'}</p>
                <p className="text-gray-500">
                  {authorPosition ? authorPosition?.charAt(0).toUpperCase() + authorPosition?.slice(1) : "Author"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DynamicBlog;
