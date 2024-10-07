"use client";

import React from "react";

import DynamicBlog from "@/components/common/DynamicBlog";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fireServices } from "@/app/services/firestoreService";
import DummyImg from "@/assets/Rectangle-2.png";

interface PageProps {
    params: {
        articleId: string;
    };
    searchParams: {};
}

const Page = (props: PageProps) => {
    const { articleId } = props?.params;

    const { data: article, error } = useQuery({
        queryKey: ["getArticle", articleId],
        queryFn: () => fireServices.getArticleById(articleId),
        placeholderData: keepPreviousData,
    });
    if (error) {
        console.error("Error fetching articles:", error);
    }

    return (
        <>
            <DynamicBlog
                mainHeading="Articles"
                title={article?.title || '-'}
                imageURL={article?.imageURL ? article.imageURL : DummyImg}
                authorName={article?.author?.author_name || ""}
                publishDate={article?.publishDate || null}
                content={article?.content || '-'}
            />
        </>
    );
};

export default Page;
