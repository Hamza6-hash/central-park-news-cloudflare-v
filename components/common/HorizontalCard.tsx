import React from "react";
import Image from "next/image";
import TruncateText from "./TruncateProps";
import { format } from "date-fns";
import { formatedDate } from "@/lib/utils";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { routes } from "@/constants";

interface HorizontalCard {
    title?: string;
    imageURL: string | StaticImageData;
    authorName?: string;
    publishDate?: any;
    content?: string;
    titleSlug?: string;
    type?: string;
    category_name?:string,
}

const HorizontalCard = ({
    title,
    imageURL,
    authorName,
    publishDate,
    content,
    titleSlug = "",
    type,
    category_name
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
                <div className="md:w-[210px]">
                    <Image
                        src={imageURL}
                        priority={true}
                        loading="eager"
                        height={800}
                        alt={"new image"}
                        className="md:max-w-[204px] md:h-[208px] rounded-md pointer-events-none select-none"
                        width={800}
                        quality={100}
                        style={{ objectFit: "cover" }}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                        <h1 className="bg-[#FFEB84] text-black text-xs capitalize font-montserrat truncate w-fit max-w-[60%] py-1 px-2  rounded-full">{category_name}</h1>
                        <h2 className="font-century-schoolbook capitalize text-2xl leading-7 text-[18px] sm:text-[24px] line-clamp-3 hover:text-primary-800 ">
                            {title || "-"}
                        </h2>
                        <div className="flex items-center gap-2  text-[12px] sm:text-[12px]">
                            <hr className="w-6 bg-primary-900 h-[1px] border-none" />

                            <h3 className="capitalize text-nowrap">{authorName || "-"}</h3>
                            <span className="text-primary-500">|</span>
                            <p className="font-medium italic text-primary-500 text-nowrap">
                                {formatedPublishDate && formatedPublishDate}
                            </p>
                        </div>
                    </div>
                    {/* <div className="text-gray-600 capitalize  text-[15px]"> */}
                    <div className="text-gray-600 capitalize font-montserrat font-normal text-[12px] sm:text-[15px]">
                        <TruncateText lines={2} content={content || "-"} />
                    </div>
                </div>
            </div>
            <hr className="w-full bg-gray-400  h-[1px] border-none mt-5" />
        </Link>
    );
};

export default HorizontalCard;
