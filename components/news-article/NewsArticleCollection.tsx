"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, doc, getDoc, query, where, orderBy, DocumentData, limit, startAfter } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import BlogsCard from "../common/BlogsCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
// import DummyImg from "@/assets/Rectangle-4.png";
// import DummyImg from "@/assets/Blockchain-Default.jpg";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import Searchbar from "../search/SearchComp";

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
    createdAt: string;
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
    const [isSearchOpen, setIsSearchOpen] = useState(false);


    const pageTitle = activeTab === "news" ? "News" : "Articles";

    const fetchedCombienItems = async () => {
        try {
            setLoading(true)
            setError(null);

            if (!db) {
                throw new Error("Database connection is not available");
            }

            const articlePath = "blog/blockchainBriefing/articles";
            const newsPath = "blog/blockchainBriefing/newsletter";

            const articleRef = collection(db, articlePath);
            const newsRef = collection(db, newsPath);

            // Build base queries for both
            const articleQuery = query(
                articleRef,
                where("status", "==", "published"),
                orderBy("createdAt", "desc")
            );
            const newsQuery = query(
                newsRef,
                where("status", "==", "published"),
                orderBy("createdAt", "desc")
            );

            const [articleSnap, newsSnap] = await Promise.all([
                getDocs(articleQuery),
                getDocs(newsQuery)
            ]);

        } catch (error) {

        }
    }

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

                // Base query for total count
                const baseQuery = query(
                    itemsRef,
                    where("status", "==", "published"),
                    orderBy("createdAt", "desc")
                );

                // Get total count
                const totalSnapshot = await getDocs(baseQuery);
                const totalItems = totalSnapshot.docs.length;
                setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));

                // Calculate start position
                const startAt = (currentPage - 1) * ITEMS_PER_PAGE;
                const startDoc = startAt > 0 ? totalSnapshot.docs[startAt - 1] : null;

                // Final query with pagination
                const q = startDoc
                    ? query(baseQuery, startAfter(startDoc), limit(ITEMS_PER_PAGE))
                    : query(baseQuery, limit(ITEMS_PER_PAGE));

                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    setItems([]);
                    setLoading(false);
                    return;
                }

                // Process each article - keeping your exact processing logic
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

                        return {
                            id: docSnapshot.id,
                            title: data.title || "",
                            content: data.content || "",
                            imageURL: data.imageURL || "/Blockchain-Default.jpg",
                            authorId: data.authorId || "",
                            authorName: authorName,
                            titleSlug: data.titleSlug || "",
                            type: activeTab,
                            createdAt: data.createdAt,
                            publishDate: {
                                seconds: data.date?.seconds || new Date().getTime() / 1000,
                                nanoseconds: data.date?.nanoseconds || 0
                            }
                        };
                    })
                );

                setItems(itemsData);
            } catch (error) {
                console.error("Error fetching items:", error);
                setError("Failed to load items. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [activeTab, currentPage]);



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
    };

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
                                    createdAt={item.createdAt}
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