import Image from "next/image";
import React from "react";
import DummyImg from "@/assets/Rectangle-4.png";

const VerticalCard = () => {
    return (
        <div className="bg-primary-300 p-2 h-80 w-[20%] relative rounded text-white">
            <Image src={DummyImg} alt={"new image"} height={250} objectFit="cover" />

            <div className="my-2.5 space-y-2">
                <h4 className="font-century-schoolbook capitalize leading-5">
                    Three Guilty Verdicts for Derek Chauvin
                </h4>
                <div className="flex items-center gap-2">
                    <hr className="w-6 h-0.5 bg-white" />
                    <div>
                        <h6 className="text-sm font-Century-751-BT capitalize">Docket Digest New Room</h6>
                        <p className="font-Century-751-BT text-xs text-gray-300">April 21,2021</p>
                    </div>
                </div>
            </div>
            <div>
                <button className="uppercase text-yellow-500 font-bold text-xs absolute right-2 bottom-2">VIEW MORE</button>
            </div>
        </div>
    );
};

export default VerticalCard;
