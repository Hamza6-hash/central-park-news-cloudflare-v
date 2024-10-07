import React from "react";
// import SuggestedBlogs from "@/components/suggestedBlogs/SuggestedBlogs";
import Image from "next/image";
import DummyImg from "@/assets/Rectangle-2.png";
import avatar from "@/assets/avatar@2x.png";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { format } from "date-fns";
import { formatedDate } from "@/lib/utils";

const SocialMediaTag = ({ icon, link }: SocialMedia) => {
    return (
        <div className="rounded-full border border-primary-500 p-2 cursor-pointer">
            {icon}
        </div>
    );
};

const socialMediaArray = [
    {
        icon: <FaTwitter className="text-primary-500" size={15} />,
        link: "",
    },
    {
        icon: <FaFacebookSquare className="text-primary-500" size={15} />,
        link: "",
    },
];

const DynamicBlog = ({
    showWritter = true,
    mainHeading,
    title,
    imageURL,
    authorName,
    publishDate,
    content,
}: DynamicBlog) => {
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
                        <h1 className="font-century-schoolbook text-3xl  max-md:text-center capitalize">
                            {title}
                        </h1>
                    </div>

                    <Image
                        src={DummyImg}
                        alt="new image"
                        height={700}
                        style={{ objectFit: "cover" }}
                    />
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

                <div className="my-8 flex w-full sm:flex-row flex-col gap-4 sm:justify-between justify-center max-sm:items-center px-sm-generic">
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
                            <div className="font-century-gothic  max-sm:text-center text-lg">
                                <p>Jane Doe</p>
                                <p className="text-gray-500">
                                    Founder and CEO, Financial Health Network
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="">
                        <p className="text-lg mb-2">Share This:</p>
                        <div className="flex gap-4">
                            {socialMediaArray.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <SocialMediaTag icon={item.icon} link={item.link} />
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DynamicBlog;
