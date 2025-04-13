import Image from "next/image";
import React from "react";
import DummyImg from "@/assets/Rectangle-4.png";
import { format } from "date-fns";
import Link from "next/link";
import { formatedDate } from "@/lib/utils";
import { routes } from "@/constants";

interface VerticalCard {
    title: string;
    imageURL: string;
    authorName: string;
    publishDate: any;
    titleSlug?: string;
    type?: "article" | "news";
}

const VerticalCard = ({
    title,
    imageURL,
    authorName,
    publishDate,
    titleSlug,
    type = "article"
}: VerticalCard) => {
    const formatedPublishDate = formatedDate(publishDate, "MMMM dd, yyyy");

    const getLinkPath = () => {
        if (type === "news") {
            return `${routes.news}/${titleSlug}`;
        }
        return `${routes.articles}/${titleSlug}`;
    };

    return (
        <div className="bg-primary-300 py-3 px-4 flex flex-col gap-3 min-w-[214px] max-w-[214px] relative rounded text-white">
            <div className="flex justify-center items-center">
                <Image
                    src={imageURL}
                    alt={"new image"}
                    // className="w-[159px] h-[121px] gap-0 custom-rounded"
                    className="w-[200px] h-[121px] gap-0 custom-rounded"
                    quality={100}
                    style={{ objectFit: "cover" }}
                    // width={159}
                    width={200}
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
                            <h6 className="text-sm capitalize font-montserrat font-wider tracking-sm">{authorName || "-"}</h6>
                            <p className="text-xs text-gray-300 italic">{formatedPublishDate && formatedPublishDate}</p>
                        </div>
                    </div>
                </div>
                <div className="h-full flex justify-end items-end flex-grow pt-3">
                    <Link href={getLinkPath()} className="uppercase font-century-gothic text-yellow-500 transition-colors duration-300 hover:text-primary-900 font-bold text-xs">
                        VIEW MORE
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerticalCard;
