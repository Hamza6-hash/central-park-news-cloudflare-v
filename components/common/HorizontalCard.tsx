import React from "react";
import Image from "next/image";
import DummyImg from "@/assets/Rectangle-4.png";

const HorizontalCard = () => {
    return (
        <div className="flex gap-4 relative rounded-sm md:h-[183px] text-black max-md:flex-col max-md:w-full">
            <div className="md:w-[204px]">
                <Image src={DummyImg} alt={"new image"} className="md:max-w-[204px] md:h-[183px]" width={800} quality={100} objectFit="cover" />
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <h4 className="font-century-schoolbook capitalize text-2xl leading-7">
                        Three Guilty Verdicts for Derek Chauvin
                    </h4>
                    <div className="flex items-center text-xs gap-2">
                        <hr className="w-6 bg-primary-900 h-[1px] border-none" />

                        <h6 className="font-Century-751-BT capitalize text-nowrap">
                            Docket Digest New Room
                        </h6>
                        <span className="text-primary-500">|</span>
                        <p className="font-Century-751-BT text-primary-500 text-nowrap">
                            April 21,2021
                        </p>
                    </div>
                </div>
                <div>
                    <p className="text-gray-600 capitalize text-[15px]">Derek Chauvin was found guilty on the three charges he faced — second-degree murder, third-degree murder, and second-degree manslaughter..</p>
                </div>
            </div>
        </div>
    );
};

export default HorizontalCard;
