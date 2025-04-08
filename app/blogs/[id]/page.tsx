import React from "react";
import DynamicBlog from "@/components/common/DynamicBlog";
import DummyImg from "@/assets/Rectangle-2.png";

const page = () => {
    return (
        <>
            <DynamicBlog
                title={""}
                imageURL={DummyImg}
                authorName={""}
                publishDate={null}
                content={""}
                showWritter={false}
                mainHeading="Blog"
                articleId="dummy-id"
            />
        </>
    );
};

export default page;
