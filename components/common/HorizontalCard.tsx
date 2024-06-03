import React from "react";
import Image from "next/image";
import DummyImg from "@/assets/Rectangle-4.png";
import TruncateText from "./TruncateProps";

const HorizontalCard = () => {
    const delLater = 'Derek Chauvin was found guilty on the three charges he faced — second-degree murder, third-degree murder, and second-degree manslaughter..'

    return (
        <div className="flex gap-4 relative text-black max-md:flex-col max-md:w-full transition-all duration-300 hover:shadow-top-news hover:p-3 rounded-lg cursor-pointer">
            <div className="md:w-[204px]">
                <Image src={DummyImg} alt={"new image"} className="md:max-w-[204px] md:h-[183px]" width={800} quality={100} objectFit="cover" />
            </div>

            <div className="flex flex-col gap-4">
                <div className="space-y-1">
                    <h4 className="font-century-schoolbook capitalize text-2xl leading-7">
                        Three Guilty Verdicts for Derek Chauvin
                    </h4>
                    <div className="flex items-center text-xs gap-2">
                        <hr className="w-6 bg-primary-900 h-[1px] border-none" />

                        <h6 className="capitalize text-nowrap">
                            Docket Digest New Room
                        </h6>
                        <span className="text-primary-500">|</span>
                        <p className="font-medium italic text-primary-500 text-nowrap">
                            April 21,2021
                        </p>
                    </div>
                </div>
                <div className="text-gray-600 capitalize text-[15px]">
                    <TruncateText lines={4} content={delLater} />
                </div>
            </div>
        </div>
    );
};

export default HorizontalCard;
