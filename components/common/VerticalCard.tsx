import React from "react";
import Link from "next/link";
import { formatedDate } from "@/lib/utils";
import { routes } from "@/constants";
import SafeImage from "@/constants/SafeImage";
import { stripMarkdown } from "@/lib/query";

interface VerticalCard {
    title: string;
    imageURL: string;
    authorName: string;
    publishDate: any;
    titleSlug?: string;
    type?: "article" | "news";
    category?: string,
    content?: string,

}

const VerticalCard = ({
    title,
    imageURL,
    content,
    publishDate,
    titleSlug,
    type = "article",
    category,
}: VerticalCard) => {
    const formatedPublishDate = formatedDate(publishDate, "MMMM dd, yyyy");

    const getLinkPath = () => {
        if (type === "news") {
            return `${routes.news}/${titleSlug}`;
        }
        return `${routes.articles}/${titleSlug}`;
    };

    return (
        <Link href={getLinkPath()} aria-label={title || "View article"}>
            <div className="group bg-primary-300 w-[245px] h-[272px] relative rounded text-white overflow-hidden">

                {/* Background Image - with relative positioning for fill to work properly */}
                <div className="inset-0 z-0 w-[245px] h-[272px] relative">
                    <SafeImage
                        src={imageURL}
                        alt={title || "Article image"}
                        fill
                        className="object-cover pointer-events-none select-none"
                        sizes="245px"
                        quality={85}
                        priority={false}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJ4HvqFvP5LHUKKjQVRKkqaKUC1lUklUgkK2U4lWEhIkQrWQqQwGQECGYsVHZ+hJEjbsOlTULqUG7QGgaQMvW3KRJg2nUPAl8mUKUEJLOhAGhpQQQXyLOIcGTgZnGfgbYFLNnLNbpqzBAJJjBCNGE"
                    />
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#FFFFFFCC]/80 backdrop-blur-[4.7px] transition-all duration-300 ease-in-out h-[160px] group-hover:h-full overflow-hidden">
                    <div className="relative w-full h-full px-4 py-4 flex flex-col justify-between">

                        <div className="mb-2 flex-shrink-0 h-[60px]">
                            <h2 className="font-century-schoolbook text-[18px] text-[#0F042D] capitalize font-normal leading-5 line-clamp-2 overflow-hidden h-full">
                                {title || "-"}
                            </h2>
                        </div>

                        <div className="absolute inset-0 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                            <p className="font-century-gothic text-[14px] text-[#0F042D] leading-5 line-clamp-5 overflow-hidden">
                                {stripMarkdown(content || "-")}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 mb-2 flex-shrink-0 h-[32px]">
                            <hr className="w-6 h-0.5 bg-[#FFFFFF] flex-shrink-0" />
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className="bg-[#303130] w-[80%] font-montserrat text-white text-xs font-medium px-2 py-1 rounded-md capitalize text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-fit">
                                    {category || "Local News"}
                                </span>
                                <p className="text-[12px] font-montserrat  font-bold text-[#0F042D] italic mt-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                                    {formatedPublishDate || ""}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default React.memo(VerticalCard); 