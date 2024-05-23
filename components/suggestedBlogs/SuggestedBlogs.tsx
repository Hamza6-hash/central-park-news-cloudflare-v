import React from "react";
import BlogsCard from "../common/BlogsCard";

const SuggestedBlogs = () => {
    return (
        <div className="bg-primary-700 mt-5 px-generic py-20 flex items-center justify-center">
            <div className="max-width">
                <h1 className="font-inter font-bold text-xl mb-2">BLOGS</h1>
                <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
                    {[1, 2, 3, 4,].map((item) => (<React.Fragment key={item}>
                        <BlogsCard showDateTimeInRow={true} />
                    </React.Fragment>))}
                </div>
            </div>
        </div>
    );
};

export default SuggestedBlogs;
