"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import BlogsCard from "../common/BlogsCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchArticleNewsData } from "@/lib/query";
import { defultImage } from "@/constants";

const ITEMS_PER_PAGE = 9;
const STALE_TIME = 5 * 60 * 1000;
const CACHE_TIME = 10 * 60 * 1000;

export default function NewsArticleCollection() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const isArticlePage = pathname.includes("/articles");
  const [activeTab, setActiveTab] = useState<"news" | "article">(
    isArticlePage ? "article" : "news"
  );

  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState(Math.max(1, pageFromUrl));

  const [debouncedPage, setDebouncedPage] = useState(currentPage);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPage(currentPage);
    }, 150);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const {
    data: item,
    isLoading,
    error,
    // @ts-ignore
    isPreviousData
  } = useQuery({
    queryKey: ['articles', activeTab, debouncedPage],
    queryFn: () => FetchArticleNewsData({
      activeTab,
      currentPage: debouncedPage,
      itemsPerPage: ITEMS_PER_PAGE
    }),
    staleTime: STALE_TIME,
    // @ts-ignore
    cacheTime: CACHE_TIME,
    keepPreviousData: true,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // @ts-ignore
    if (item?.hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: ['articles', activeTab, debouncedPage + 1],
        queryFn: () => FetchArticleNewsData({
          activeTab,
          currentPage: debouncedPage + 1,
          itemsPerPage: ITEMS_PER_PAGE
        }),
        staleTime: STALE_TIME,
      });
    }
    // @ts-ignore
  }, [item?.hasNextPage, activeTab, debouncedPage, queryClient]);

  const updateUrl = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }

    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  const handlePageChange = useCallback((page: number) => {
    if (page === currentPage) return;

    setCurrentPage(page);
    updateUrl(page);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, updateUrl]);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    if (urlPage !== currentPage && urlPage > 0) {
      setCurrentPage(urlPage);
    }
  }, [searchParams]);

  useEffect(() => {
    const newTab = pathname.includes("/articles") ? "article" : "news";
    if (newTab !== activeTab) {
      setActiveTab(newTab);
      setCurrentPage(1);
      updateUrl(1);
    }
  }, [pathname, activeTab, updateUrl]);
  // @ts-ignore
  const items = item?.items || [];
  // @ts-ignore
  const totalPages = item?.totalPages || 1;
  // @ts-ignore
  const totalItems = item?.totalItems || 0;
  // @ts-ignore
  const hasNextPage = item?.hasNextPage || false;
  // @ts-ignore
  const hasPrevPage = item?.hasPrevPage || false;
  const pageTitle = activeTab === "news" ? "News" : "Articles";

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const maxVisiblePages = 5;
    const pageNumbers = [];

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
      <div className="max-w-7xl mx-auto w-full px-1 py-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <div
            className="w-20 h-0.5 border-0"
            style={{
              background: 'linear-gradient(90deg, #408ED7 0%, #224B71 100%)',
            }}
          />

          <div className="flex flex-row gap-3 w-full">
            <h1 className="text-xl md:text-2xl font-century-gothic font-bold text-[#2B4864]">
              {pageTitle}
            </h1>

          </div>
        </div>

        {/* Subtitle Section */}
        <div className="mt-4">
          <h2 className="text-base md:text-lg text-[#2B4864] font-century-gothic">
            Central Park  / <span className="font-semibold">News</span>
          </h2>


        </div>
      </div>

      {/* Content Area */}
      {isLoading && !isPreviousData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mt-[53px] w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-12">
          {Array.from({ length: ITEMS_PER_PAGE }, (_, index) => (
            <div key={index} className="w-full flex justify-center">
              <div className="bg-white transition-shadow w-full max-w-[350px]">
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4 text-sm sm:text-base">
            {error instanceof Error ? error.message : 'No News Found'}
          </div>
        </div>
      ) : (
        <>

          {isPreviousData && (
            <div className="max-w-7xl mx-auto px-4">
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded text-sm">
                Loading new page...
              </div>
            </div>
          )}

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mt-[53px] w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 ${isPreviousData ? 'opacity-75' : ''}`}>
            {/*@ts-ignore */}
            {items.map((item) => (
              <div key={item.id} className="w-full">
                <BlogsCard
                  title={item.title}
                  content={item.content}
                  imageURL={item.imageURL || defultImage}
                  isFeatured={item.isFeatured || false}
                  authorName={item.authorName}
                  createdAt={item.createdAt}
                  showDateTimeInRow={true}
                  titleSlug={item.titleSlug}
                  type={activeTab}
                  category_name={item.category_name}
                />
              </div>
            ))}
          </div>

          {/* Enhanced Pagination */}
         {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem className="hidden md:block">
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (hasPrevPage) handlePageChange(currentPage - 1);
                      }}
                      className={
                        !hasPrevPage
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer hover:bg-gray-100'
                      }
                    />
                  </PaginationItem>
                  <div className="hidden md:flex">
                    {(() => {
                      const pages = [];
                      const maxVisible = 5;

                      if (totalPages <= maxVisible) {
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        pages.push(1);

                        let start, end;
                        if (currentPage <= 3) {
                          start = 2;
                          end = 4;
                        } else if (currentPage >= totalPages - 2) {
                          start = totalPages - 3;
                          end = totalPages - 1;
                        } else {
                          start = currentPage - 1;
                          end = currentPage + 1;
                        }
                        if (start > 2) {
                          pages.push('ellipsis1');
                        }

                        // Add middle pages
                        for (let i = start; i <= end; i++) {
                          if (i > 1 && i < totalPages) {
                            pages.push(i);
                          }
                        }

                        if (end < totalPages - 1) {
                          pages.push('ellipsis2');
                        }

                        if (totalPages > 1) {
                          pages.push(totalPages);
                        }
                      }

                      return pages.map((page, index) => {
                        if (page === 'ellipsis1' || page === 'ellipsis2') {
                          return (
                            <PaginationItem key={`ellipsis-${index}`}>
                              <span className="px-3 py-2">...</span>
                            </PaginationItem>
                          );
                        }

                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={currentPage === page}
                              className="cursor-pointer hover:bg-gray-100"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      });
                    })()}
                  </div>

                  <div className="flex md:hidden">
                    {/* Left Arrow for Mobile */}
                    <PaginationItem>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (hasPrevPage) handlePageChange(currentPage - 1);
                        }}
                        className={`px-3 py-2 ${
                          !hasPrevPage
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer hover:bg-gray-100'
                        }`}
                      >
                        &lt;
                      </button>
                    </PaginationItem>

                    {(() => {
                      if (totalPages <= 3) {
                        return Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={currentPage === page}
                              className="cursor-pointer hover:bg-gray-100"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ));
                      } else {
                        const pages = [];

                        // Always show page 1
                        pages.push(1);

                        if (currentPage > 2 && currentPage < totalPages) {
                          pages.push('ellipsis1');
                          pages.push(currentPage);
                          if (currentPage < totalPages - 1) {
                            pages.push('ellipsis2');
                          }
                        } else if (currentPage === 2) {
                          pages.push('ellipsis1');
                        } else if (currentPage === totalPages && totalPages > 3) {
                          pages.push('ellipsis1');
                        }

                        if (totalPages > 1) {
                          pages.push(totalPages);
                        }

                        return pages.map((page, index) => {
                          if (page === 'ellipsis1' || page === 'ellipsis2') {
                            return (
                              <PaginationItem key={`ellipsis-${index}`}>
                                <span className="px-2 py-2 text-sm">..</span>
                              </PaginationItem>
                            );
                          }

                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(page);
                                }}
                                isActive={currentPage === page}
                                className="cursor-pointer hover:bg-gray-100"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        });
                      }
                    })()}

                    {/* Right Arrow for Mobile */}
                    <PaginationItem>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (hasNextPage) handlePageChange(currentPage + 1);
                        }}
                        className={`px-3 py-2 ${
                          !hasNextPage
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer hover:bg-gray-100'
                        }`}
                      >
                        &gt;
                      </button>
                    </PaginationItem>
                  </div>

                  <PaginationItem className="hidden md:block">
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (hasNextPage) handlePageChange(currentPage + 1);
                      }}
                      className={
                        !hasNextPage
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer hover:bg-gray-100'
                      }
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