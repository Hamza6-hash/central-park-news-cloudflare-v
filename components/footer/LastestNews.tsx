import React, { useRef, useState } from "react";
import VerticalCard from "../common/VerticalCard";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import { db } from "@/lib/firebaseConfig";
import { usePathname } from "next/navigation";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    DocumentData,
} from "firebase/firestore";
// import DummyImg from "@/assets/Rectangle-4.png";
import DummyImg from "@/assets/Blockchain-Default.jpg";
import { Skeleton } from "@/components/ui/skeleton";

interface Article {
    id: string;
    title: string;
    content: string;
    imageURL?: string;
    authorId: string;
    authorName?: string;
    publishDate: string;
    date?: {
        seconds: number;
        nanoseconds: number;
    };
    formattedDate?: string;
    categoryId?: string;
    featuredArticle?: boolean;
    tags?: string;
    titleSlug?: string;
    type?: "article" | "news";
    createdAt?: string;
}

const LastestNews = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isReversed, setIsReversed] = useState(false);
    const productContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const pathname = usePathname();

    const getTitle = () => {
        if (pathname.includes("/news")) {
            return "Latest Articles";
        } else if (pathname.includes("/articles")) {
            return "Latest News";
        } else {
            return "Latest Articles";
        }
    };

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if database is available
            if (!db) {
                throw new Error("Database connection is not available");
            }

            // Determine which collection to fetch based on the current path
            const collectionPath = pathname.includes("/news")
                ? "blog/blockchainBriefing/articles"
                : pathname.includes("/articles")
                    ? "blog/blockchainBriefing/newsletter"
                    : "blog/blockchainBriefing/articles";

            // Fetch articles from the appropriate collection
            const articlesRef = collection(db, collectionPath);
            const articlesQuery = query(
                articlesRef,
                where("status", "==", "published")
            );
            const articlesSnapshot = await getDocs(articlesQuery);

            if (articlesSnapshot.empty) {
                setError("No articles available at the moment.");
                setLoading(false);
                return;
            }

            // Process each article
            const articlesData = await Promise.all(
                articlesSnapshot.docs.map(async (articleDoc) => {
                    const articleData = articleDoc.data() as Article;

                    // Get author name from authors collection
                    let authorName = "Unknown Author";
                    if (articleData.authorId) {
                        try {
                            const authorDocRef = doc(
                                db,
                                "blog/blockchainBriefing/authors",
                                articleData.authorId
                            );
                            const authorDoc = await getDoc(authorDocRef);
                            if (authorDoc.exists()) {
                                const authorData = authorDoc.data() as DocumentData;
                                authorName = authorData.author_name || "Unknown Author";
                            }
                        } catch (error) {
                            console.error("Error fetching author:", error);
                        }
                    }

                    // Format the date based on the collection
                    let formattedDate = "Unknown Date";
                    if (articleData.createdAt) {
                        try {
                            const date = new Date(articleData.createdAt);
                            formattedDate = date.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            });
                        } catch (error) {
                            console.error("Error formatting date:", error);
                        }
                    }

                    return {
                        ...articleData,
                        id: articleDoc.id,
                        authorName: authorName,
                        formattedDate: formattedDate,
                        createdAt: articleData?.createdAt || formattedDate,
                        publishDate: formattedDate,
                        titleSlug: articleData.titleSlug,
                        type: collectionPath.includes("newsletter")
                            ? "news" as const
                            : "article" as const,
                    };
                })
            );

            // Sort articles by date
            // Sort articles by date
            articlesData.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            setArticles(articlesData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching articles:", error);
            setError("Failed to load articles. Please try again later.");
            setLoading(false);
        }
    };


    React.useEffect(() => {
        fetchArticles();
    }, [pathname]);

    const slideRight = () => {
        if (productContainerRef.current) {
            const container = productContainerRef.current;
            const cardWidth = 214; // Width of each card (214px from VerticalCard)
            const gap = 16; // Gap between cards (gap-4 = 16px)
            const scrollAmount = cardWidth + gap;
            const maxScroll = container.scrollWidth - container.clientWidth;
            const currentScroll = container.scrollLeft;

            if (currentScroll >= maxScroll - 10) {
                // If we're at the end, automatically start scrolling left
                setIsReversed(true);
                container.scrollTo({
                    left: Math.max(0, currentScroll - scrollAmount),
                    behavior: 'smooth'
                });
            } else {
                // Normal forward scroll
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
            const cardWidth = 214; // Width of each card
            const gap = 16; // Gap between cards
            const scrollAmount = cardWidth + gap;
            const currentScroll = container.scrollLeft;

            if (currentScroll <= 10) {
                // If we're at the start, automatically start scrolling right
                setIsReversed(false);
                container.scrollTo({
                    left: Math.min(container.scrollWidth - container.clientWidth, currentScroll + scrollAmount),
                    behavior: 'smooth'
                });
            } else {
                // Normal backward scroll
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

            // Check if we're at the beginning or end
            if (currentScroll <= 10) {
                setIsReversed(false);
            } else if (currentScroll >= maxScroll - 10) {
                setIsReversed(true);
            }
        }
    };

    React.useEffect(() => {
        const container = productContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // handling the scroll button visibility
    React.useEffect(() => {
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
    }, [articles]); // Also recheck when articles update


    if (loading) {
        return (
            <section className="lastestNews py-[58px] px-generic">
                <div className="max-width w-full">
                    <h1 className="uppercase text-3xl font-bold text-white mb-4">
                        {getTitle()}
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
                {error}
            </div>
        );
    }

    if (!articles?.length) return null;

    return (
        <section className="lastestNews py-[58px] px-8">
            <div className="max-width w-full">
                <h1 className="uppercase text-3xl font-bold text-white mb-4">
                    {getTitle()}
                </h1>
                <div className="flex gap-6 items-center justify-between relative w-full mx-auto">
                    <div
                        ref={productContainerRef}
                        className="w-full flex gap-4 overflow-x-scroll hide-scrollbar mx-auto py-1"
                    >
                        {articles.map((article, index) => (
                            <React.Fragment key={index}>
                                <VerticalCard
                                    title={article.title}
                                    imageURL={article.imageURL || DummyImg.src}
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
