import React, { useEffect, useRef, useState } from "react";
import VerticalCard from "../common/VerticalCard";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import { usePathname } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { defultImage } from "@/constants";
import { FetchLatestNews } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";


const LastestNews = () => {
    const [isReversed, setIsReversed] = useState(false);
    const productContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const pathname = usePathname();

    const { data: articles, isLoading, error } = useQuery({
        queryKey: ['latestNews', pathname],
        queryFn: FetchLatestNews,
        retry: 2,
        staleTime: 1000 * 60 * 7,
    })



    const slideRight = () => {
        if (productContainerRef.current) {
            const container = productContainerRef.current;
            const cardWidth = 214;
            const gap = 16;
            const scrollAmount = cardWidth + gap;
            const maxScroll = container.scrollWidth - container.clientWidth;
            const currentScroll = container.scrollLeft;

            if (currentScroll >= maxScroll - 10) {
                setIsReversed(true);
                container.scrollTo({
                    left: Math.max(0, currentScroll - scrollAmount),
                    behavior: 'smooth'
                });
            } else {

                container.scrollTo({
                    left: Math.min(maxScroll, currentScroll + scrollAmount),
                    behavior: 'smooth'
                });
                setIsReversed(false);
            }
        }
    };

    const slideLeft = () => {
        if (productContainerRef.current) {
            const container = productContainerRef.current;
            const cardWidth = 214;
            const gap = 16;
            const scrollAmount = cardWidth + gap;
            const currentScroll = container.scrollLeft;

            if (currentScroll <= 10) {

                setIsReversed(false);
                container.scrollTo({
                    left: Math.min(container.scrollWidth - container.clientWidth, currentScroll + scrollAmount),
                    behavior: 'smooth'
                });
            } else {
                container.scrollTo({
                    left: Math.max(0, currentScroll - scrollAmount),
                    behavior: 'smooth'
                });
                setIsReversed(true);
            }
        }
    };

    const handleScroll = () => {
        if (productContainerRef.current) {
            const container = productContainerRef.current;
            const maxScroll = container.scrollWidth - container.clientWidth;
            const currentScroll = container.scrollLeft;

            if (currentScroll <= 10) {
                setIsReversed(false);
            } else if (currentScroll >= maxScroll - 10) {
                setIsReversed(true);
            }
        }
    };

    useEffect(() => {
        const container = productContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        const container = productContainerRef.current;
        if (container) {
            const updateScrollButtonVisibility = () => {
                const scrollable = container.scrollWidth > container.clientWidth;
                setShowScrollButton(scrollable);
            };

            updateScrollButtonVisibility();

            container.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', updateScrollButtonVisibility);
            return () => {
                container.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', updateScrollButtonVisibility);
            };
        }
    }, [articles]);


    if (isLoading) {
        return (
            <section className="lastestNews py-[58px] px-generic">
                <div className="max-width w-full">
                    <h1 className="uppercase text-3xl font-bold text-white mb-4">
                        LATEST NEWS
                    </h1>
                    <div className="flex gap-6 items-center justify-between relative w-full mx-auto">
                        <div className="w-full flex gap-4 overflow-x-scroll hide-scrollbar mx-auto py-1">
                            {[1, 2, 3, 4].map((index) => (
                                <div key={index} className="min-w-[214px] flex-shrink-0">
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-[160px] w-full rounded-lg bg-gray-100" />
                                        <Skeleton className="h-4 w-3/4 bg-gray-100" />
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-3 w-20 bg-gray-100" />
                                            <Skeleton className="h-3 w-3 bg-gray-100" />
                                            <Skeleton className="h-3 w-16 bg-gray-100" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="bg-primary-300 p-2 rounded-full">
                            <GoArrowRight color="white" size={25} />
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <div className="py-[58px] px-generic text-center text-red-500">
                Failed To Fetch
            </div>
        );
    }

    if (!articles?.length) return null;

    return (
        <section className="lastestNews py-[58px] px-8">
            <div className="max-width w-full">
                <h1 className="uppercase text-3xl font-bold text-white mb-4">
                    LATEST NEWS
                </h1>
                <div className="flex gap-6 items-center justify-between relative w-full mx-auto">
                    <div
                        ref={productContainerRef}
                        className="w-full flex gap-4 overflow-x-scroll hide-scrollbar mx-auto py-1"
                    >
                        {articles.slice(0,12).map((article, index) => (
                            <React.Fragment key={index}>
                                <VerticalCard
                                    title={article.title}
                                    imageURL={article.imageURL || defultImage}
                                    authorName={article.authorName || "Unknown Author"}
                                    publishDate={article.publishDate}
                                    titleSlug={article.titleSlug}
                                    type={article.type}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                    {showScrollButton && (
                        <button
                            className="bg-primary-300 p-2 rounded-full"
                            onClick={isReversed ? slideLeft : slideRight}
                            aria-label={isReversed ? "Scroll left" : "Scroll right"}
                        >
                            {isReversed ? (
                                <GoArrowLeft color="white" size={25} />
                            ) : (
                                <GoArrowRight color="white" size={25} />
                            )}
                        </button>
                    )}

                </div>
            </div>
        </section>
    );
};

export default LastestNews;
