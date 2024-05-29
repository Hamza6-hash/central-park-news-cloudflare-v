"use client";

import React from "react";
import BlogsCard from "../common/BlogsCard";
import { routes } from "@/constants";
import { usePathname } from "next/navigation";

const SuggestedBlogs = () => {
    const pathName = usePathname();
    const isActive =
        pathName === routes.articles || pathName.startsWith(`${routes.articles}/`);

    return (
        <div className="bg-primary-700 px-generic md:py-14 py-10 flex items-center justify-center">
            <div className="max-width">
                <h1 className="font-bold text-[32px] text-primary-900 mb-7 uppercase">{isActive ? 'BLOGS' : 'Articles'}</h1>
                <div className="grid grid-cols-4 md:gap-4 gap-8 max-xl:grid-cols-2 max-md:grid-cols-1">
                    {[1, 2, 3, 4,].map((item) => (<React.Fragment key={item}>
                        <BlogsCard showDateTimeInRow={true} />
                    </React.Fragment>))}
                </div>
            </div>
        </div>
    );
};

export default SuggestedBlogs;
