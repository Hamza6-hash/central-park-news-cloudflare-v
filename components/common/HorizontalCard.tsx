import React from "react";
import TruncateText from "./TruncateProps";
import { formatedDate } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { routes } from "@/constants";
import { stripMarkdown } from "@/lib/query";
import { defultImage } from "@/constants";


interface HorizontalCard {
    title?: string;
    imageURL: string | StaticImageData;
    authorName?: string;
    publishDate?: any;
    content?: string;
    titleSlug?: string;
    type?: string;
    category?: string,
    imageName?: string

}

const HorizontalCard = ({
    title,
    imageURL,
    authorName,
    publishDate,
    content,
    titleSlug = "",
    type,
    category,
    imageName,
}: HorizontalCard) => {
    const formatedPublishDate = formatedDate(publishDate, "MMMM dd, yyyy");
    const getLinkPath = () => {
        if (type === "news") {
            return `${routes.news}/${titleSlug}`;
        }
        return `${routes.articles}/${titleSlug}`;
    };

    return (
        <Link href={getLinkPath()}>
            <div className="flex gap-4 relative text-black max-md:flex-col max-md:w-full transition-all duration-300 rounded-lg cursor-pointer">
                <div className="md:w-[210px] w-full rounded-[16px] ">
                    <div className="relative w-full md:w-[204px] aspect-[204/208] rounded-[16px]">
                        <Image
                            src={imageURL || defultImage}
                            priority={true}
                            loading="eager"
                            fill
                            alt={imageName || 'No Name'}
                            quality={75}
                            className="pointer-events-none select-none rounded-[16px]"
                            sizes="(max-width: 768px) 100vw, (min-width: 769px) 204px"
                        />
                    </div>
                </div>


                <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                        <h1 className="bg-[#E4212B] text-white text-xs capitalize font-montserrat truncate w-fit max-w-[70%] py-1 px-2  rounded-full">{category || 'Local News'}</h1>
                        <h2 className="font-century-schoolbook capitalize text-2xl leading-7 text-[18px] sm:text-[24px] line-clamp-3 hover:text-primary-800 ">
                            {title || "-"}
                        </h2>
                        <div className="flex items-center gap-2  text-[12px] sm:text-[12px]">
                            <hr className="w-6 bg-primary-900 h-[1px] border-none" />

                            <h3 className="capitalize text-nowrap">{authorName || "-"}</h3>
                            <span className="text-primary-500">|</span>
                            <p className="font-medium italic text-[#E4212B] text-nowrap">
                                {formatedPublishDate && formatedPublishDate}
                            </p>
                        </div>
                    </div>
                    <div className="text-gray-600 line-clamp-2 capitalize font-montserrat font-normal text-[12px] sm:text-[15px]">
                        <TruncateText lines={2} content={stripMarkdown(content || "-")} />
                    </div>
                </div>
            </div>
            <hr className="w-full bg-gray-400  h-[1px] border-none mt-5" />
        </Link>
    );
};

export default HorizontalCard;
