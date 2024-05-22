import React from "react";

const AppDownloadButton = ({
    icon,
    subHeading,
    heading,
}: AppDownloadButton) => {
    return (
        <button className="border border-primary-900 flex sm:gap-3.5 gap-2.5 items-center rounded font-inter py-1 sm:px-5 px-3">
            <div>{icon}</div>
            <div className="flex flex-col justify-start">
                <p className="text-[10px] font-bold font-inter text-start">{subHeading}</p>
                <p className="md:text-base sm:text-sm text-xs font-semibold font-inter text-start leading-6">{heading}</p>
            </div>
        </button>
    );
};

export default AppDownloadButton;
