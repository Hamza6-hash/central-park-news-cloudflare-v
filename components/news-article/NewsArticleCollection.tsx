"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, doc, getDoc, query, where, orderBy, DocumentData, limit, startAfter } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import BlogsCard from "../common/BlogsCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import DummyImg from "@/assets/Rectangle-4.png";
import { StaticImageData } from "next/image";

interface Article {
    id: string;
    title: string;
    content: string;
    imageURL?: string | StaticImageData;
    authorId: string;
    authorName?: string;
    publishDate: {
        seconds: number;
        nanoseconds: number;
    };
    titleSlug: string;
}

interface Author {
    author_name: string;
}

interface DummyArticle extends Omit<Article, 'imageURL'> {
    imageURL: StaticImageData;
}

interface FirestoreArticle extends Omit<Article, 'imageURL'> {
    imageURL?: string;
}

const dummyContent = "Derek Chauvin was found guilty on the three charges he faced — second-degree murder, third-degree murder, and second-degree manslaughter.";

const ITEMS_PER_PAGE = 9;

export default function NewsArticleCollection() {
    const pathname = usePathname();
    const router = useRouter();
    const isArticlePage = pathname.includes("/articles");
    const [activeTab, setActiveTab] = useState<"news" | "article">(isArticlePage ? "article" : "news");
    const [items, setItems] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const pageTitle = activeTab === "news" ? "News" : "Articles";

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!db) {
                    throw new Error("Database connection is not available");
                }

                const collectionPath = activeTab === "article" 
                    ? "blog/blockchainBriefing/articles"
                    : "blog/blockchainBriefing/newsletter";
                const itemsRef = collection(db, collectionPath);
                const orderByField = activeTab === "article" ? "publishDate" : "date";

                let q = query(
                    itemsRef,
                    orderBy(orderByField, "desc"),
                    limit(ITEMS_PER_PAGE)
                );

                // Get total count for pagination
                const totalSnapshot = await getDocs(itemsRef);
                const totalItems = totalSnapshot.size;
                setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));

                // If not on first page, apply startAfter
                if (currentPage > 1) {
                    const previousItems = await getDocs(q);
                    const lastVisible = previousItems.docs[(currentPage - 1) * ITEMS_PER_PAGE - 1];
                    q = query(
                        itemsRef,
                        orderBy(orderByField, "desc"),
                        startAfter(lastVisible),
                        limit(ITEMS_PER_PAGE)
                    );
                }

                const snapshot = await getDocs(q);
                
                if (snapshot.empty) {
                    setItems([]);
                    setLoading(false);
                    return;
                }

                // Process each article
                const itemsData = await Promise.all(
                    snapshot.docs.map(async (docSnapshot) => {
                        const data = docSnapshot.data();
                        let authorName = "Docket Digest News Room";
                        
                        if (data.authorId) {
                            try {
                                const authorRef = doc(db, "blog/blockchainBriefing/authors", data.authorId);
                                const authorSnap = await getDoc(authorRef);
                                if (authorSnap.exists()) {
                                    const authorData = authorSnap.data() as Author;
                                    authorName = authorData.author_name;
                                }
                            } catch (error) {
                                console.error("Error fetching author:", error);
                            }
                        }

                        const baseSlug = data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';

                        return {
                            id: docSnapshot.id,
                            title: data.title || "",
                            content: data.content || "",
                            imageURL: data.imageURL || DummyImg,
                            authorId: data.authorId || "",
                            authorName: authorName,
                            titleSlug: baseSlug,
                            type: activeTab,
                            publishDate: activeTab === "news" 
                                ? {
                                    seconds: data.date?.seconds || new Date().getTime() / 1000,
                                    nanoseconds: data.date?.nanoseconds || 0
                                }
                                : data.publishDate || {
                                    seconds: new Date().getTime() / 1000,
                                    nanoseconds: 0
                                }
                        };
                    })
                );

                // Handle duplicate titles and generate unique slugs
                const slugCounts = new Map<string, number>();
                const updatedItems = itemsData.map(item => {
                    const count = slugCounts.get(item.titleSlug) || 0;
                    slugCounts.set(item.titleSlug, count + 1);
                    
                    // For duplicate titles, append sequential number (except first occurrence)
                    const uniqueSlug = count > 0 ? `${item.titleSlug}-${count + 1}` : item.titleSlug;
                    
                    return {
                        ...item,
                        titleSlug: uniqueSlug
                    };
                });
                
                setItems(updatedItems);
            } catch (error) {
                console.error("Error fetching items:", error);
                setError("Failed to load items. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [activeTab, currentPage]);

    // Update active tab when pathname changes
    useEffect(() => {
        const newTab = pathname.includes("/articles") ? "article" : "news";
        if (newTab !== activeTab) {
            setActiveTab(newTab);
            setCurrentPage(1);
            setItems([]);
        }
    }, [pathname]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Function to generate page numbers array
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5; // Show max 5 page numbers at a time
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust start if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
    };

    return (
        <section className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 max-w-7xl mx-auto w-full pl-0 pr-4 sm:pr-6 md:pr-8 lg:pr-10 xl:pr-12">
                <h1 className='heading text-center sm:text-left'>{pageTitle}</h1>
                
                {/* Buttons aligned to the right */}
                <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 w-auto">
                    <button
                        onClick={() => {
                            setActiveTab("news");
                            setCurrentPage(1);
                            router.push("/news");
                        }}
                        className={`min-w-[80px] w-auto px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-md transition-colors ${
                            activeTab === "news"
                                ? "bg-primary-900 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        News
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("article");
                            setCurrentPage(1);
                            router.push("/articles");
                        }}
                        className={`min-w-[80px] w-auto px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-md transition-colors ${
                            activeTab === "article"
                                ? "bg-primary-900 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Articles
                    </button>
                </div>
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
                    {error}
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
                                    publishDate={item.publishDate}
                                    showDateTimeInRow={true}
                                    titleSlug={item.titleSlug}
                                    type={activeTab}
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

                                    {getPageNumbers().map((pageNumber) => (
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