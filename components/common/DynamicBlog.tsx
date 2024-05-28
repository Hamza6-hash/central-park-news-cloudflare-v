import React from 'react';
import SuggestedBlogs from "@/components/suggestedBlogs/SuggestedBlogs";
import Image from "next/image";
import DummyImg from "@/assets/Rectangle-2.png";
import avatar from "@/assets/avatar@2x.png";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

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
        link: ''
    },
    {
        icon: <FaFacebookSquare className="text-primary-500" size={15} />,
        link: ''
    },
]

const DynamicBlog = ({ showWritter = true, mainHeading }: DynamicBlog) => {
    return (
        <section>
            <div className='flex items-center max-md:justify-center max-md:flex-col gap-2'>
                <h1 className='heading'>{mainHeading}</h1>
                <div className='flex items-center gap-2'>
                    <MdOutlineKeyboardArrowRight color='#A3A0A0' size={35} />
                    <h6 className='font-century-schoolbook capitalize'>Oligarch Son Told to Pay Mom</h6>
                </div>
            </div>

            <div className="mt-14">
                <div className="space-y-3 mb-4">
                    <div className='px-sm-generic'>
                        <h1 className="font-century-schoolbook text-3xl  max-md:text-center capitalize">Oligarch Son Told to Pay Mom</h1>
                    </div>

                    <Image src={DummyImg} alt="new image" height={700} objectFit="cover" />
                    <div className="flex items-center sm:text-lg text-sm px-sm-generic gap-2">
                        <hr className="w-6 h-1" />
                        <h6 className="capitalize">Docket Digest News Room</h6>
                        <span className="text-primary-500">|</span>
                        <p className="text-primary-500 italic">April 21, 2021</p>
                    </div>
                </div>
                <article className="space-y-3  sm:text-lg text-justify px-sm-generic capitalize">
                    <p>After losing a court decision over his part in shielding assets from his mother, Temur Akhmedov, the son of a Russian oligarch embroiled in the UK’s biggest divorce lawsuit, will have to compensate his mother $100 million.</p>
                    <p>{`Temur Akhmedov and his billionaire father, Farkhad Akhmedov, worked together to prevent his mother from receiving a $627 million court-ordered divorce settlement. The court described Temur as “an untrustworthy person who will go to every length to help his parent (referring to father).”`}</p>
                    <p>The trial drew public attention when Temur admitted to losing more than $50 million while day trading as a college student. He argued that instead of shielding his father’s wealth from his mother, he lost some of it by poor investments.</p>
                    <p>Temur’s mother is attempting to reclaim some of the money by demanding the keys to a luxurious apartment overlooking London’s Hyde Park. She has been denied any divorce settlements, forcing her to depend on attorneys in helping her prosecute lawsuits in at least six nations.</p>
                </article>

                <div className="my-8 flex w-full sm:flex-row flex-col gap-4 sm:justify-between justify-center max-sm:items-center px-sm-generic">
                    {showWritter === true && <div className="flex gap-2 flex-col max-sm:justify-center max-sm:items-center">
                        <h4 className="text-lg">Written By:</h4>
                        <div className="w-12 h-12 relative rounded-full">
                            <Image src={avatar} alt="new image" fill objectFit="cover" />
                        </div>
                        <div className='font-century-gothic  max-sm:text-center text-lg'>
                            <p>Jane Doe</p>
                            <p className="text-gray-500">Founder and CEO, Financial Health Network</p>
                        </div>
                    </div>}

                    <div className="">
                        <p className="text-lg mb-2">Share This:</p>
                        <div className="flex gap-4">
                            {socialMediaArray.map((item) => {

                                return (<React.Fragment key={item.link}>
                                    <SocialMediaTag icon={item.icon} link={item.link} />
                                </React.Fragment>)
                            })}
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default DynamicBlog