'use client';

import React from "react";
// import SuggestedBlogs from "@/components/suggestedBlogs/SuggestedBlogs";
import Image from "next/image";
import { StaticImageData } from "next/image";
import avatar from "@/assets/avatar@2x.png";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { format } from "date-fns";
import { formatedDate } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import user from '/assets/user.png'
import ReactMarkdown from 'react-markdown';
// import DummyImage from "@/assets/Rectangle-2.png";
import DummyImage from "@/assets/Blockchain-Default.jpg";
import Searchbar from "@/components/search/SearchComp";
import { Search, Slash } from "lucide-react";

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
    <section>
      <div className="flex flex-col md:flex-row max-md:justify-center  gap-2">
        <div className="flex gap-4 items-center ">
          <Link
            href={mainHeading === "News" ? "/news" : `/articles`}
            className="flex items-center gap-2"
          >
            <h1 className="heading">{mainHeading}</h1>
          </Link>
          <button onClick={(e) => setIsSearchOpen(true)
          }><Search /></button>

          <Searchbar
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />

        </div>
        <div className="flex items-center gap-1">
          <span className="shrink-0">
            <Slash size={17} />
          </span>
          <h6 className="font-century-schoolbook text-primary-200 capitalize">
            {title}
          </h6>
        </div>

      </div>

      <div className="mt-14">
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

          <div className="relative w-full h-[514px]">
            <Image
              src={imageURL || DummyImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* extra div added to ensure the lines stays with the author name and maintain consistency */}
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
