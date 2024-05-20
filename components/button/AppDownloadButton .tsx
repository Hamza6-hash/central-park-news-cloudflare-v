import React from "react";

const AppDownloadButton = ({
    icon,
    subHeading,
    heading,
}: AppDownloadButton) => {
    return (
        <button className="border border-primary-900 flex gap-3.5 items-center rounded font-inter py-1 px-5">
            <div>{icon}</div>
            <div className="flex flex-col justify-start">
                <p className="text-[10px] font-bold font-inter text-start">{subHeading}</p>
                <p className="text-base font-semibold font-inter leading-6">{heading}</p>
            </div>
        </button>
    );
};

export default AppDownloadButton;
