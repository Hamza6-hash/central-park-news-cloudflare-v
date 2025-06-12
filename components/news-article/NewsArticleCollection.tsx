"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import BlogsCard from "../common/BlogsCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
const Search = dynamic(() => import("lucide-react").then(mod => mod.Search), {
    ssr: false,
});

import Searchbar from "../search/SearchComp";
import { useQuery } from "@tanstack/react-query";
import { FetchArticleNewsData } from "@/lib/query";
import dynamic from "next/dynamic";


const ITEMS_PER_PAGE = 9;

export default function NewsArticleCollection() {
    const pathname = usePathname();
    const isArticlePage = pathname.includes("/articles");
    const [activeTab, setActiveTab] = useState<"news" | "article">(isArticlePage ? "article" : "news");
    const [currentPage, setCurrentPage] = useState(1);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const {
        data: item,
        isLoading,
        refetch,
        error
    } = useQuery({
        queryKey: ['articles', activeTab, currentPage],
        queryFn: () => FetchArticleNewsData({
            activeTab,
            currentPage,
            itemsPerPage: ITEMS_PER_PAGE
        }),
        staleTime: 5 * 60 * 1000,
        retry: 2
    });



    // Extract data from useQuery result
    const items = item?.items || [];
    const totalPages = item?.totalPages || 1;
    const loading = isLoading;
    // @ts-ignore
    const errorMessage = error?.message || null;

    const pageTitle = activeTab === "news" ? "News" : "Articles";



    useEffect(() => {
        const newTab = pathname.includes("/articles") ? "article" : "news";
        if (newTab !== activeTab) {
            setActiveTab(newTab);
            setCurrentPage(1);
        }
    }, [pathname]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Function to generate page numbers array
    const pageNumbers = useMemo(() => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    }, [currentPage, totalPages]);



    return (
        <section className="w-full">
            <hr className={`w-64 h-0.5 mb-2 bg-gray-200`} />
            <div className="flex gap-2 items-center max-w-7xl mx-auto w-full ">
                <h1 className="heading md:text-left ">{pageTitle}</h1>
                <button onClick={(e) => setIsSearchOpen(true)
                }><Search /></button>

                <Searchbar
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                />
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mt-[53px] w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                        <div key={index} className="w-full flex justify-center">
                            <div className="bg-white transition-shadow w-full max-w-[337px]">
                                <Skeleton className="h-[150px] sm:h-[180px] md:h-[200px] w-full rounded-md bg-gray-100" />
                                <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                                    <Skeleton className="h-4 sm:h-5 md:h-6 w-3/4 bg-gray-100" />
                                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                        <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 md:w-52 bg-gray-100" />
                                        <Skeleton className="h-3 sm:h-4 w-3 sm:w-4 bg-gray-100" />
                                        <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 md:w-24 bg-gray-100" />
                                    </div>
                                    <Skeleton className="h-12 sm:h-16 md:h-20 w-full bg-gray-100" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4 text-sm sm:text-base">
                    No News Found
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mt-[53px] w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                        {items.map((item) => (
                            <div key={item.id} className="w-full">
                                <BlogsCard
                                    title={item.title}
                                    content={item.content}
                                    imageURL={item.imageURL}
                                    authorName={item.authorName}
                                    // publishDate={item.publishDate}
                                    createdAt={item.createdAt}
                                    showDateTimeInRow={true}
                                    titleSlug={item.titleSlug}
                                    type={activeTab}
                                    category_name={item.category_name}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Updated Pagination */}
                    {totalPages > 1 && (
                        <div className='mt-8 flex justify-center'>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage > 1) handlePageChange(currentPage - 1);
                                            }}
                                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>

                                    {pageNumbers.map((pageNumber) => (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(pageNumber);
                                                }}
                                                isActive={currentPage === pageNumber}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                            }}
                                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            )}
        </section>
    );
} 