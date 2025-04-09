import Image from "next/image";
import React from "react";
import DummyImg from "@/assets/Rectangle-4.png";
import { format } from "date-fns";
import Link from "next/link";
import { formatedDate } from "@/lib/utils";

interface VerticalCard {
    title: string;
    imageURL: string;
    authorName: string;
    publishDate: any;
    titleSlug?: string;
}

const VerticalCard = ({
    title,
    imageURL,
    authorName,
    publishDate,
    titleSlug,
}: VerticalCard) => {
    const formatedPublishDate = formatedDate(publishDate, "MMMM dd, yyyy");

    return (
        <div className="bg-primary-300 py-3 px-4 flex flex-col gap-3 min-w-[214px] max-w-[214px] relative rounded text-white">
            <div className="flex justify-center items-center">
                <Image
                    src={imageURL}
                    alt={"new image"}
                    className="w-[159px] h-[121px] gap-0 custom-rounded"
                    quality={100}
                    style={{ objectFit: "cover" }}
                    width={159}
                    height={121}
                />
            </div>
            <div className="flex flex-grow flex-col gap-1.5 h-full">
                <h4 className="font-century-schoolbook capitalize leading-5">
                    {title || "-"}
                </h4>

                <div className="">
                    <div className="flex items-center gap-2">
                        <hr className="w-6 h-0.5 bg-white" />
                        <div>
                            <h6 className="text-xs capitalize">{authorName || "-"}</h6>
                            <p className="text-xs text-gray-300 italic">{formatedPublishDate && formatedPublishDate}</p>
                        </div>
                    </div>
                </div>
                <div className="h-full flex justify-end items-end flex-grow pt-3">
                    <Link href={`/articles/${titleSlug?.split('-').slice(0, -1).join('-') || titleSlug}`} className="uppercase font-century-gothic text-yellow-500 transition-colors duration-300 hover:text-primary-900 font-bold text-xs">
                        VIEW MORE
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerticalCard;
