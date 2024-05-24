import Image from "next/image";
import React from "react";
import DummyImg from "@/assets/Rectangle-4.png";

const BlogsCard = ({ showDateTimeInRow = false }: BlogsCard) => {
    const dateRowCol = showDateTimeInRow ? "flex md:flex-col max-md:items-end max-md:gap-1" : "flex items-center gap-2";

    const hideLine = showDateTimeInRow ? 'hidden' : '';

    return (
        <div className={`${!showDateTimeInRow ? 'bg-primary-700' : 'max-md:bg-gray-800'} p-4 relative rounded-sm`}>
            <Image src={DummyImg} alt={"new image"} height={500} quality={100} objectFit="cover" />

            <div className="my-2.5 space-y-2">
                <h4 className="font-century-schoolbook max-md:text-center capitalize leading-5">
                    Three Guilty Verdicts for Derek Chauvin
                </h4>
                <div className="flex items-center gap-2.5">
                    <hr className="w-6 h-1" />
                    <div className={dateRowCol}>
                        <h6 className="text-sm font-Century-751-BT text-dark-400 capitalize">
                            Docket Digest New Room
                        </h6>
                        <span className={hideLine}>|</span>
                        <p className="font-Century-751-BT text-xs text-dark-400">
                            April 21,2021
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <p className="text-gray-600 text-sm">Derek Chauvin was found guilty on the three charges he faced — second-degree murder, third-degree murder, and second-degree manslaughter..</p>
            </div>

            <div className="flex justify-end items-end mt-6 mb-1.5">
                <button className="uppercase text-primary-900 font-bold text-xs">
                    VIEW MORE
                </button>
            </div>
        </div>
    );
};

export default BlogsCard;
