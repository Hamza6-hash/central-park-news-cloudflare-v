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
        <Link href={getLinkPath()}>
            <div className="bg-primary-300 min-w-[252px] max-w-[214px] h-[272px] relative rounded text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={imageURL}
                        alt={title || "Article image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        quality={85}
                        priority={false}
                    />
                </div>
                {/* <div className="absolute  z-10"></div> */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-[#1E3D5AEB] transition-all duration-300 ease-in-out hover:bg-[#193753] hover:pb-6">
                    <div className="mb-3">
                        <h4 className="font-century-schoolbook capitalize font-normal leading-5 line-clamp-2">
                            {title || "-"}
                        </h4>
                    </div>

                    <div className="flex items-center gap-2">
                        <hr className="w-6 h-0.5 bg-white" />
                        <div className="flex flex-col">
                            <h6 className="text-sm capitalize font-montserrat font-wider font-normal tracking-sm">{authorName || "-"}</h6>
                            <p className="text-xs text-gray-300 italic">{formatedPublishDate && formatedPublishDate}</p>
                        </div>
                    </div>
                </div>
                {/* <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-[#1E3D5AEB]">
                    <div className="mb-3">
                        <h4 className="font-century-schoolbook capitalize font-normal leading-5 line-clamp-2">
                            {title || "-"}
                        </h4>
                    </div>

                    <div className="flex items-center gap-2">
                        <hr className="w-6 h-0.5 bg-white" />
                        <div className="flex flex-col">
                            <h6 className="text-sm capitalize font-montserrat font-wider font-normal tracking-sm">{authorName || "-"}</h6>
                            <p className="text-xs text-gray-300 italic">{formatedPublishDate && formatedPublishDate}</p>
                        </div>
                    </div>
                </div> */}
            </div>
        </Link>
    );
};

export default VerticalCard; 