import React, { useRef, useState } from "react";
import VerticalCard from "../common/VerticalCard";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import { db } from "@/lib/firebaseConfig";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    DocumentData,
} from "firebase/firestore";
import DummyImg from "@/assets/Rectangle-4.png";

interface Article {
    id: string;
    title: string;
    content: string;
    imageURL?: string;
    authorId: string;
    authorName?: string;
    publishDate: {
        seconds: number;
        nanoseconds: number;
    };
    date?: string;
    categoryId?: string;
    featuredArticle?: boolean;
    tags?: string;
    titleSlug?: string;
}

const LastestNews = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isReversed, setIsReversed] = useState(false);
    const productContainerRef = useRef<HTMLDivElement>(null);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if database is available
            if (!db) {
                throw new Error("Database connection is not available");
            }

            // Fetch articles from the articles collection
            const articlesRef = collection(db, "blog/blockchainBriefing/articles");
            const articlesSnapshot = await getDocs(articlesRef);

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

                    // Format the date
                    let formattedDate = "Unknown Date";
                    if (articleData.publishDate) {
                        try {
                            const date = new Date(articleData.publishDate.seconds * 1000);
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
                        date: formattedDate,
                    };
                })
            );

            // Sort articles by publish date
            articlesData.sort((a, b) => b.publishDate.seconds - a.publishDate.seconds);

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
    }, []);

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
            const cardWidth = 214;
            const gap = 16;
            const scrollAmount = cardWidth + gap;
            const currentScroll = container.scrollLeft;
            
            if (currentScroll <= 10) {
                // If we're at the beginning, automatically start scrolling right
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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-[58px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
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

    // Process duplicate titles
    const slugCounts = new Map<string, number>();
    const articlesWithSlugs = articles.map(article => {
        const baseSlug = article.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';
        const count = slugCounts.get(baseSlug) || 0;
        slugCounts.set(baseSlug, count + 1);
        
        // For duplicate titles, append sequential number (except first occurrence)
        const titleSlug = count > 0 ? `${baseSlug}-${count + 1}` : baseSlug;
        
        // Ensure the slug is properly formatted
        const formattedSlug = titleSlug.replace(/-+/g, '-').replace(/^-|-$/g, '');
        
        return {
            ...article,
            titleSlug: formattedSlug
        };
    });

    return (
        <section className="lastestNews py-[58px] px-generic">
            <div className="max-width w-full">
                <h1 className="uppercase text-3xl font-bold text-white mb-4">
                    Latest Articles
                </h1>
                <div className="flex gap-6 items-center justify-between relative w-full mx-auto">
                    <div
                        ref={productContainerRef}
                        className="w-full flex gap-4 overflow-x-scroll hide-scrollbar mx-auto py-1"
                    >
                        {articlesWithSlugs.map((article, index) => (
                            <React.Fragment key={index}>
                                <VerticalCard
                                    title={article.title}
                                    imageURL={article.imageURL || DummyImg.src}
                                    authorName={article.authorName || "Unknown Author"}
                                    publishDate={article.publishDate}
                                    titleSlug={article.titleSlug}
                                />
                            </React.Fragment>
                        ))}
                    </div>
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
                </div>
            </div>
        </section>
    );
};

export default LastestNews;
