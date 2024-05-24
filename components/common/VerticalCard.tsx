import Image from "next/image";
import React from "react";
import DummyImg from "@/assets/Rectangle-4.png";

const VerticalCard = () => {
    return (
        <div className="bg-primary-300 py-3 px-4 flex flex-col gap-3 h-[270px] min-w-[214px] max-w-[214px] relative rounded text-white">
            <div className="flex justify-center items-center">
                <Image src={DummyImg} alt={"new image"} className="w-[159px] h-[121px] gap-0 custom-rounded" quality={100} objectFit="cover" />
            </div>
            <div className="flex flex-col gap-1.5">
                <h4 className="font-century-schoolbook font-normal capitalize leading-5">
                    Three Guilty Verdicts for Derek Chauvin
                </h4>

                <div className="">
                    <div className="flex items-center gap-2">
                        <hr className="w-6 h-0.5 bg-white" />
                        <div>
                            <h6 className="text-xs font-Century-751-BT capitalize">Docket Digest New Room</h6>
                            <p className="font-Century-751-BT text-xs text-gray-300">April 21,2021</p>
                        </div>
                    </div>
                </div>
                <div className="h-full flex justify-end pt-3">
                    <button className="uppercase text-yellow-500 font-bold text-xs">VIEW MORE</button>
                </div>
            </div>
        </div>

    );
};

export default VerticalCard;
