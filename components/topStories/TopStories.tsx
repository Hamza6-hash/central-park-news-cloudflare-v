import React from "react";
import HorizontalCard from "../common/HorizontalCard";
import { usePathname } from "next/navigation";
import { routes } from "@/constants";
import { Button } from "../button/Button";

const TopStories = ({ showViewMore = false }: TopStories) => {
    let delLater = showViewMore ? [1, 2] : [1, 2, 3, 4, 5, 6, 7, 8];
    const pathName = usePathname();
    const activeRoute =
        pathName === routes.contact || pathName.startsWith(`${routes.contact}/`);

    return (
        <div className="px-sm-generic">
            <h2 className="font-bold text-2xl mb-4">
                TOP <span className="text-primary-500">10</span> STORIES
            </h2>
            <div className="flex flex-col xl:gap-5 sm:gap-7 gap-8">
                {delLater.map((item, index) => (
                    <React.Fragment key={index}>
                        <HorizontalCard />
                    </React.Fragment>
                ))}
            </div>

            {showViewMore && (
                <div className="flex justify-end items-end mt-6">
                    <button className="uppercase text-primary-900  transition-colors duration-300 hover:text-yellow-500 font-bold text-sm xl:block hidden">
                        VIEW MORE
                    </button>
                    <Button
                        variant="primary"
                        className="xl:hidden block transition-colors duration-300 hover:text-yellow-500"
                    >
                        VIEW MORE
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TopStories;
