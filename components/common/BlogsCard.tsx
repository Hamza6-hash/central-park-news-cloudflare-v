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
    type = "article"
}: BlogsCard) => {
    const formattedDate = new Date(publishDate.seconds * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const getLinkPath = () => {
        if (type === "news") {
            return `${routes.news}/${titleSlug}`;
        }
        return `${routes.articles}/${titleSlug}`;
    };

    return (
        <div className="bg-[#67B6DF24] capitalize relative w-[337px] h-[435px] rounded-[6px] p-6 flex flex-col gap-4">
            <div className="relative w-full h-[290px] rounded-[6px] overflow-hidden">
                <Image
                    src={imageURL}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="space-y-0">
                <h1 className="font-century-schoolbook text-2xl capitalize leading-7">
                    {title}
                </h1>
                <div className="flex items-center gap-1.5">
                    <hr className="w-4 sm:w-5 h-1" />
                    <div className="flex items-center gap-2">
                        <h6 className="text-dark-400 capitalize font-century-725 text-xs leading-none">
                            {authorName}
                        </h6>
                        <span>|</span>
                        <h6 className="italic text-sm text-dark-400 capitalize">
                            {formattedDate}
                        </h6>
                    </div>
                </div>
            </div>

            <div className="text-gray-600 text-[15px] font-century-gothic leading-[142%] capitalize">
                <TruncateText lines={3} content={content} />
            </div>

            <div className="flex justify-end items-end mt-auto">
                <Link href={getLinkPath()} className="">
                    <p className="uppercase text-primary-900 font-bold transition-colors duration-300 hover:text-yellow-500 text-xs">
                        VIEW MORE
                    </p>
                </Link>
            </div>
        </div>
    );
};

export default BlogsCard;
