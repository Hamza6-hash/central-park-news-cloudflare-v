"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BlogsCard from "@/components/common/BlogsCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import NewsArticleSkeleton from "./NewsArticleSkeleton";

const ITEMS_PER_PAGE = 9;

interface Article {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  isFeatured?: boolean;
  authorName: string;
  createdAt: string;
  titleSlug: string;
  type: string;
  category_name?: string;
}

interface PaginationData {
  items: Article[];
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentPage: number;
}

interface NewsArticleCollectionProps {
  initialData?: PaginationData;
}

export default function NewsArticleCollection({ initialData }: NewsArticleCollectionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isArticlePage = pathname.includes("/articles");
  const [activeTab, setActiveTab] = useState<"news" | "article">(
    isArticlePage ? "article" : "news"
  );

  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState(Math.max(1, pageFromUrl));

  // Server-side data state
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch data from server-side API
  const fetchPageData = useCallback(async (page: number, type: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/articles/pagination?page=${page}&itemsPerPage=${ITEMS_PER_PAGE}&type=${type}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPaginationData(data);
    } catch (err) {
      console.error('Error fetching page data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  // Use initial data on first load if available
  useEffect(() => {
    if (initialData && currentPage === 1 && activeTab === "news" && isInitialLoad) {
      setPaginationData(initialData);
      setIsInitialLoad(false);
      return;
    }

    // Fetch data when page or tab changes
    fetchPageData(currentPage, activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeTab]);

  // Update URL when page changes
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

  // Extract data from pagination state
  const items = paginationData?.items || [];
  const totalPages = paginationData?.totalPages || 1;
  const hasNextPage = paginationData?.hasNextPage || false;
  const hasPrevPage = paginationData?.hasPrevPage || false;
  const pageTitle = activeTab === "news" ? "News" : "Articles";

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;

    setCurrentPage(page);
    updateUrl(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, updateUrl, totalPages]);

  // Sync with URL changes
  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    if (urlPage !== currentPage && urlPage > 0) {
      setCurrentPage(urlPage);
    }
  }, [searchParams, currentPage]);

  // Handle tab changes
  useEffect(() => {
    const newTab = pathname.includes("/articles") ? "article" : "news";
    if (newTab !== activeTab) {
      setActiveTab(newTab);
      setCurrentPage(1);
      updateUrl(1);
    }
  }, [pathname, activeTab, updateUrl]);

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
            Central Park News / <span className="font-semibold">News</span>
          </h2>
        </div>
      </div>

      {/* Content Area */}
      {isInitialLoad ? (
        <NewsArticleSkeleton />
      ) : error ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className=" px-4 py-3 rounded mt-4 text-sm sm:text-base">
            No Articles Found
          </div>
        </div>
      ) : (
        <>
          {isLoading ? (
            <NewsArticleSkeleton />
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mt-[53px] w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 transition-opacity duration-200  `}>
              {items?.map((item) => (
                <div key={item.id} className="w-full">
                  <BlogsCard
                    title={item.title}
                    content={item.content}
                    imageURL={item.imageURL || '/main.webp'}
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
          )}
          {/* Enhanced Pagination */}
          {!isLoading && totalPages > 1 && (
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
                                handlePageChange(Number(page));
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
                        className={`px-3 py-2 ${!hasPrevPage
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
                                handlePageChange(Number(page));
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
                                  handlePageChange(Number(page));
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
                        className={`px-3 py-2 ${!hasNextPage
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