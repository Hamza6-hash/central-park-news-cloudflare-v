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
        icon: <FaTwitter className="text-primary-900 group-hover:text-white transition-colors" size={15} />,
        link: "",
    },
    {
        icon: <FaFacebookSquare className="text-primary-900 group-hover:text-white transition-colors" size={15} />,
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
    isArticlePage = false
}) => {
    const formatedPublishDate = formatedDate(publishDate, "MMMM dd, yyyy");

    return (
        <section>
            <div className="flex items-center max-md:justify-center max-md:flex-col gap-2">
                <h1 className="heading">{mainHeading}</h1>
                <div className="flex items-center gap-2">
                    <MdOutlineKeyboardArrowRight color="#A3A0A0" size={35} />
                    <h6 className="font-century-schoolbook capitalize">
                        {title}
                    </h6>
                </div>
            </div>

            <div className="mt-14">
                <div className="space-y-3 mb-4">
                    <div className="px-sm-generic">
                        {isArticlePage ? (
                            <h1 className="font-century-schoolbook text-3xl max-md:text-center capitalize">
                                {title}
                            </h1>
                        ) : (
                            <h1 className="font-century-schoolbook text-3xl max-md:text-center capitalize">
                                {title}
                            </h1>
                        )}
                    </div>

                    <div className="relative w-full h-[514px]">
                        <Image
                            src={imageURL || 'no-img'}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    <div className="flex items-center sm:text-lg text-sm px-sm-generic gap-2">
                        <hr className="w-6 h-1" />
                        <h6 className="capitalize">{authorName}</h6>
                        <span className="text-primary-500">|</span>
                        <p className="text-primary-500 italic">{formatedPublishDate && formatedPublishDate}</p>
                    </div>
                </div>
                <article className="space-y-3  sm:text-lg text-justify px-sm-generic capitalize">
                    {content}
                </article>

                <div className="my-8 flex w-full sm:flex-row flex-col gap-4 sm:justify-between sm:items-center justify-center max-sm:items-center px-sm-generic">
                    {showWritter === true && (
                        <div className="flex gap-2 flex-col max-sm:justify-center max-sm:items-center">
                            <h4 className="text-lg">Written By:</h4>
                            <div className="w-12 h-12 relative rounded-full">
                                <Image
                                    src={avatar}
                                    alt="new image"
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div className="font-century-gothic max-sm:text-center text-lg">
                                <p>{authorName}</p>
                                <p className="text-gray-500">
                                    Founder and CEO, Financial Health Network
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        {socialMediaArray.map((item, index) => (
                            <SocialMediaTag key={index} {...item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DynamicBlog;
