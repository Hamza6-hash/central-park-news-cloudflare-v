import React, { useRef, useState } from "react";
import VerticalCard from "../common/VerticalCard";
import { GoArrowRight } from "react-icons/go";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fireServices } from "@/app/services/firestoreService";
import DummyImg from "@/assets/Rectangle-4.png";

const LastestNews = () => {
    const [limit, setLimit] = useState(5);

    const { data: articles, error } = useQuery({
        queryKey: ["getArticlesWithOffset", limit],
        queryFn: () => fireServices.getArticlesWithOffset(10, limit),
        placeholderData: keepPreviousData,
    });

    if (error) {
        console.error("Error fetching articles:", error);
    }

    const productContainerRef = useRef<HTMLDivElement>(null);

    const slideLeft = () => {
        if (productContainerRef.current) {
            productContainerRef.current.scrollLeft -= 230;
        }
    };

    const slideRight = () => {
        if (articles && articles.length === limit)
            setLimit((prevLimit) => prevLimit + 1);
        if (productContainerRef.current) {
            setLimit((prevLimit) => prevLimit + 1);
            productContainerRef.current.scrollLeft += 230;
        }
    };

    if (!articles?.length) return;

    return (
        <section className="lastestNews py-[58px] px-generic">
            <div className="max-width w-full">
                <h1 className="uppercase text-3xl font-bold text-white mb-4">
                    Latest news
                </h1>
                <div className="flex gap-6 items-center justify-between relative w-full mx-auto">
                    <div
                        ref={productContainerRef}
                        className="w-full flex gap-4 overflow-x-scroll hide-scrollbar mx-auto py-1"
                    >
                        {articles?.map((article, index) => (
                            <React.Fragment key={index}>
                                <VerticalCard
                                    title={article?.title}
                                    imageURL={article?.imageURL ? article.imageURL : DummyImg}
                                    authorName={article?.author?.author_name || ""}
                                    publishDate={article?.publishDate}
                                    articleId={article?.id}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                    <button
                        className="bg-primary-300 p-2 rounded-full"
                        onClick={slideRight}
                    >
                        <GoArrowRight color="white" size={25} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LastestNews;
