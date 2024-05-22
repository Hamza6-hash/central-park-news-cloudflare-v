import React from "react";
import BlogsCard from "../common/BlogsCard";

const SuggestedBlogs = () => {
    return (
        <div className="bg-primary-700 mt-5 px-generic py-20 removingDefalutgap">
            <h1 className="font-inter font-bold text-xl mb-2">BLOGS</h1>
            <div className="flex gap-6">
                {[1, 2, 3, 4,].map((item) => (<React.Fragment key={item}>
                    <BlogsCard />
                </React.Fragment>))}
            </div>
        </div>
    );
};

export default SuggestedBlogs;
