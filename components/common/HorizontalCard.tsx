import React from "react";
import Image from "next/image";
import DummyImg from "@/assets/Rectangle-4.png";

const HorizontalCard = () => {
    return (
        <div className="p-2 flex gap-3 relative rounded-sm text-black">
            <Image src={DummyImg} alt={"new image"} width={600} objectFit="cover" />

            <div className="my-2.5 space-y-2">
                <h4 className="font-century-schoolbook capitalize text-xl leading-5">
                    Three Guilty Verdicts for Derek Chauvin
                </h4>
                <div className="flex items-center gap-2">
                    <hr className="w-6 h-1" />

                    <h6 className="text-sm font-Century-751-BT capitalize">
                        Docket Digest New Room
                    </h6>
                    <span className="text-primary-500">|</span>
                    <p className="font-Century-751-BT text-xs text-primary-500">
                        April 21,2021
                    </p>

                </div>
                <div>
                    <p className="text-gray-600 text-sm">Derek Chauvin was found guilty on the three charges he faced — second-degree murder, third-degree murder, and second-degree manslaughter..</p>
                </div>
            </div>
        </div>
    );
};

export default HorizontalCard;
