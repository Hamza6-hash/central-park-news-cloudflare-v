import React from "react";
import Link from "next/link";
import { formatedDate } from "@/lib/utils";
import { defultImage, routes } from "@/constants";
import SafeImage from "@/constants/SafeImage";

interface VerticalCard {
    title: string;
    imageURL: string;
    authorName: string;
    publishDate: any;
    titleSlug?: string;
    type?: "article" | "news";
    category?: string,
}

const VerticalCard = ({
    title,
    imageURL,
    authorName,
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
        <Link href={getLinkPath()} aria-label={title || "View article"} >
            {/* <div className="bg-primary-300 min-w-[252px] max-w-[214px] h-[272px] relative rounded text-white overflow-hidden"> */}
            <div className="bg-primary-300 w-[245px] h-[272px] relative rounded text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <SafeImage
                        src={imageURL}
                        alt={title || "Article image"}
                        fill
                        className="object-cover pointer-events-none select-none"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        quality={85}
                        priority={false}
                    />

                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-[#1E3D5AEB] transition-all duration-300 ease-in-out hover:bg-[#193753] hover:pb-6">
                    <div className="mb-3">
                        <h2 className="font-century-schoolbook capitalize font-normal leading-5 line-clamp-2 text-white">
                            {title || "-"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <hr className="w-6 h-0.5 bg-white" />
                        <div className="flex flex-col">
                            <span className="bg-[#FFEB84] font-montserrat text-[#7D6901] text-xs font-medium px-2 text-center py-1 rounded-md">
                                {category}
                            </span>
                            <p className="text-xs text-gray-300 italic">
                                {formatedPublishDate && formatedPublishDate}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>

        // <Link href={getLinkPath()}>
        //     <div className="bg-primary-300 min-w-[252px] max-w-[214px] h-[272px] relative rounded text-white overflow-hidden">
        //         <div className="absolute inset-0 z-0">
        //             <Image
        //                 src={imageURL}
        //                 alt={title || "Article image"}
        //                 fill
        //                 className="object-cover pointer-events-none select-none"
        //                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        //                 quality={85}
        //                 priority={false}
        //             />
        //         </div>
        //         {/* <div className="absolute  z-10"></div> */}
        //         <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-[#1E3D5AEB] transition-all duration-300 ease-in-out hover:bg-[#193753] hover:pb-6">
        //             <div className="mb-3">
        //                 <h4 className="font-century-schoolbook capitalize font-normal leading-5 line-clamp-2">
        //                     {title || "-"}
        //                 </h4>
        //             </div>

        //             <div className="flex items-center gap-2">
        //                 <hr className="w-6 h-0.5 bg-white" />
        //                 <div className="flex flex-col">
        //                     <h6 className="text-sm capitalize font-montserrat font-wider font-normal tracking-sm">{authorName || "-"}</h6>
        //                     <p className="text-xs text-gray-300 italic">{formatedPublishDate && formatedPublishDate}</p>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </Link>
    );
};

export default VerticalCard; 