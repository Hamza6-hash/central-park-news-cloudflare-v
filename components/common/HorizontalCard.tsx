import React from "react";
import Image from "next/image";
import TruncateText from "./TruncateProps";
import { format } from "date-fns";
import { formatedDate } from "@/lib/utils";
import { StaticImageData } from "next/image";

interface HorizontalCard {
    title?: string;
    imageURL: string | StaticImageData;
    authorName?: string;
    publishDate?: any;
    content?: string;
}

const HorizontalCard = ({
    title,
    imageURL,
    authorName,
    publishDate,
    content,
}: HorizontalCard) => {
    const formatedPublishDate = formatedDate(publishDate, "MMMM dd, yyyy");

    return (
        <div className="flex gap-4 relative text-black max-md:flex-col max-md:w-full transition-all duration-300 hover:shadow-top-news hover:p-3 rounded-lg cursor-pointer">
            <div className="md:w-[204px]">
                <Image
                    src={imageURL}
                    // fill
                    height={800}
                    alt={"new image"}
                    className="md:max-w-[204px] md:h-[183px]"
                    width={800}
                    quality={100}
                    style={{ objectFit: "cover" }}
                />
            </div>

            <div className="flex flex-col gap-4">
                <div className="space-y-1">
                    <h4 className="font-century-schoolbook capitalize text-2xl leading-7">
                        {title || "-"}
                    </h4>
                    <div className="flex items-center text-xs gap-2">
                        <hr className="w-6 bg-primary-900 h-[1px] border-none" />

                        <h6 className="capitalize text-nowrap">{authorName || "-"}</h6>
                        <span className="text-primary-500">|</span>
                        <p className="font-medium italic text-primary-500 text-nowrap">
                            {formatedPublishDate && formatedPublishDate}
                        </p>
                    </div>
                </div>
                <div className="text-gray-600 capitalize text-[15px]">
                    <TruncateText lines={4} content={content || "-"} />
                </div>
            </div>
        </div>
    );
};

export default HorizontalCard;
