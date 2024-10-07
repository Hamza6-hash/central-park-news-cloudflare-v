import DynamicBlog from "@/components/common/DynamicBlog";
import React from "react";
import DummyImg from "@/assets/Rectangle-2.png";

const Articles = () => {
    return (
        <>
            <DynamicBlog
                mainHeading='Articles'
                title={""}
                imageURL={DummyImg}
                authorName={""}
                publishDate={null}
                content={""}
            />
        </>
    );
};

export default Articles;
