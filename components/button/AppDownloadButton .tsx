import React from "react";

interface AppDownloadButtonProps {
  icon: React.ReactNode;
  subHeading: string;
  heading: string;
}

const AppDownloadButton = ({
    icon,
    subHeading,
    heading,
}: AppDownloadButtonProps) => {
    return (
        <button className="border border-primary-900 flex sm:gap-4 gap-3 items-center rounded font-inter py-1 px-3">
            <div>{icon}</div>
            <div className="flex flex-col gap-1 justify-start">
                <p>{subHeading}</p>
                <p>{heading}</p>
            </div>
        </button>
    );
};

export default AppDownloadButton;
