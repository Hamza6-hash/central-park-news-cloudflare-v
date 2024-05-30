"use client"

import Image from "next/image";
import React from "react";
import DummyImg from "@/assets/Rectangle-4.png";
import Link from "next/link";
import { routes } from "@/constants";
import TruncateText from "./TruncateProps";

const BlogsCard = ({ showDateTimeInRow = false }: BlogsCard) => {
    const dateRowCol = showDateTimeInRow ? "flex md:flex-col max-md:items-end max-md:gap-1" : "flex items-center gap-2";

    const hideLine = showDateTimeInRow ? 'hidden' : '';

    const delLater = 'Derek Chauvin was found guilty on the three charges he faced — second-degree murder, third-degree murder, and second-degree manslaughter. Derek Chauvin was found guilty on the three charges he faced — second-degree murder, third-degree murder, and second-degree manslaughter.'

    return (
        <div className={`${!showDateTimeInRow ? 'bg-primary-700  p-5' : 'max-md:bg-gray-800 py-3 px-3.5'} capitalize relative rounded-md`}>
            <Image src={DummyImg} alt={"new image"} height={500} quality={100} objectFit="cover" />

            <div className="mt-2.5 mb-5 space-y-1">
                <h1 className={`font-century-schoolbook text-2xl capitalize leading-7 ${showDateTimeInRow && 'tracking-tighter  max-md:text-center'}`}>
                    Three Guilty Verdicts for Derek Chauvin
                </h1>
                <div className="flex items-center gap-1.5">
                    <hr className="sm:w-5 w-4 h-1" />
                    <div className={dateRowCol}>
                        <h6 className="text-sm text-dark-400 capitalize">
                            Docket Digest New Room
                        </h6>
                        <span className={hideLine}>|</span>
                        <h6 className="italic text-sm text-dark-400 capitalize">
                            April 21,2021
                        </h6>
                    </div>
                </div>
            </div>

            <div className="text-gray-600 text-[15px]">
                <TruncateText lines={3} content={delLater} />
            </div>

            <div className="flex justify-end items-end mt-6 mb-1.5">
                <Link href={`${routes.blogs}/2`} className="">
                    <p className="uppercase text-primary-900 font-bold transition-colors duration-300 hover:text-yellow-500 text-xs">
                        VIEW MORE
                    </p>
                </Link>
            </div>
        </div>
    );
};

export default BlogsCard;
