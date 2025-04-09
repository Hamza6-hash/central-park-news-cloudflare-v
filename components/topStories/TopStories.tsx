import React from "react";
import HorizontalCard from "../common/HorizontalCard";
import { usePathname } from "next/navigation";
import { routes } from "@/constants";
import { Button } from "../button/Button";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import DummyImg from "@/assets/Rectangle-4.png";
import Link from "next/link";
import { collection, getDocs, doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface Article {
    id: string;
    title?: string;
    content?: string;
    authorId?: string;
    authorName?: string;
    publishDate?: any;
    imageURL?: string;
    tags?: string;
    categoryId?: string;
    featuredArticle?: boolean;
    titleSlug?: string;
}

const TopStories = () => {
    const pathName = usePathname();
    const isContactPage = pathName === routes.contact;

    const { data: articles, error, isLoading } = useQuery<Article[]>({
        queryKey: ["getAllArticles"],
        queryFn: async () => {
            if (!db) {
                throw new Error('Database connection is not available');
            }

            try {
                const articlesRef = collection(db, "blog/blockchainBriefing/articles");
                const snapshot = await getDocs(articlesRef);
                
                if (snapshot.empty) {
                    console.log('No articles found');
                    return [];
                }

                // Process articles and sort by publish date (newest first)
                const articlesWithData = await Promise.all(
                    snapshot.docs.map(async (articleDoc) => {
                        const data = articleDoc.data() as Article;
                        
                        try {
                            // Get author name
                            let authorName = 'Unknown Author';
                            if (data.authorId) {
                                const authorRef = doc(db, 'blog/blockchainBriefing/authors', data.authorId);
                                const authorDoc = await getDoc(authorRef);
                                if (authorDoc.exists()) {
                                    const authorData = authorDoc.data() as DocumentData;
                                    authorName = authorData.author_name || 'Unknown Author';
                                }
                            }

                            // Format date
                            let formattedDate = null;
                            if (data.publishDate) {
                                const timestamp = data.publishDate;
                                formattedDate = new Date(timestamp.seconds * 1000);
                            }

                            // Generate base slug from title
                            const baseSlug = data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';

                            return {
                                ...data,
                                id: articleDoc.id,
                                authorName,
                                publishDate: formattedDate,
                                baseSlug
                            };
                        } catch (error) {
                            console.error('Error processing article:', articleDoc.id, error);
                            return {
                                ...data,
                                id: articleDoc.id,
                                authorName: 'Unknown Author',
                                baseSlug: data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
                            };
                        }
                    })
                );

                // Sort by publish date (newest first)
                const sortedArticles = articlesWithData.sort((a, b) => {
                    const dateA = a.publishDate?.getTime() || 0;
                    const dateB = b.publishDate?.getTime() || 0;
                    return dateB - dateA;
                });

                // Process duplicate titles
                const slugCounts = new Map<string, number>();
                const processedArticles = sortedArticles.map(article => {
                    const count = slugCounts.get(article.baseSlug) || 0;
                    slugCounts.set(article.baseSlug, count + 1);
                    
                    // For duplicate titles, append number to slug (except first occurrence)
                    const titleSlug = count > 0 ? `${article.baseSlug}-${count + 1}` : article.baseSlug;
                    
                    return {
                        ...article,
                        titleSlug
                    };
                });

                return processedArticles;
            } catch (error) {
                console.error("Error fetching articles:", error);
                throw new Error('Failed to fetch articles. Please try again later.');
            }
        },
        placeholderData: keepPreviousData,
        retry: 2,
        staleTime: 1000 * 60 * 5,
    });

    if (error) {
        return (
            <div className="px-sm-generic">
                <h2 className="font-bold text-2xl mb-4 font-century-gothic">
                    TOP <span className="text-primary-500">STORIES</span>
                </h2>
                <div className="text-red-500">Error loading articles. Please try again later.</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="px-sm-generic">
                <h2 className="font-bold text-2xl mb-4 font-century-gothic">
                    TOP <span className="text-primary-500">STORIES</span>
                </h2>
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
            </div>
        );
    }

    // Update delLater based on the current page
    const displayedArticles = isContactPage ? articles?.slice(0, 2) : articles;

    // Check if we should show the "VIEW MORE" button
    const showViewMoreButton = isContactPage && articles && articles?.length > 2;

    return (
        <div className="px-sm-generic">
            {/* <button onClick={() => {
                fireServices.addArticle({
                    title: `DirecTV's buying its rival for $1 (kinda)`,
                    content: `In the satellite TV equivalent of Godzilla and Kong teaming up against Skar King, DirecTV announced it's buying longtime rival Dish for $1 in a deal that unites the two providers as they fight to maintain relevance in the age of streaming.

The complex deal entails DirecTV buying Dish (and Sling) from its parent company, EchoStar, for $1 and the assumption of nearly $10 billion in debt. At the same time, private equity firm TPG will buy AT&T's 70% stake in DirecTV for $7.6 billion, giving TPG full ownership of the combined company (it bought the other 30% of DirecTV from AT&T in 2021).

It's a bid to save the satellites. The two companies have lost a combined 63% of their customers since 2016. The merger will make DirecTV the largest US TV distributor, with 18 million subscribers—a number that CEO Bill Morrow hopes will help it negotiate better deals and offer smaller packages, so customers aren't forced into paying for the Bob Ross Channel and Disney Junior.

Looking ahead…the deal is subject to regulatory approval—though Morrow said he's confident that regulators won't block the merger (which they did the last time the companies tried to merge in 2002)—before DirecTV upholds its promise to investors to cut $1 billion in costs annually. That's typically corporate speak for layoffs.—CC`,
                    authorId: "Cassandra Cassidy",
                    publishDate: new Date().toISOString(),
                    imageURL: "", // Add a default empty string or actual image URL
                    tags: "", // Add a default empty string or actual tags
                    categorieId: "", // Add a default empty string or actual category ID
                    featuredArticle: false// Add a default empty string or actual category ID
                });
            }}>Add Article</button> */}
            <h2 className="font-bold text-2xl mb-4 font-century-gothic">
                TOP <span className="text-primary-500">STORIES</span>
            </h2>
            <div className="flex flex-col xl:gap-5 sm:gap-7 gap-8">
                {displayedArticles?.map((article) => (
                    <React.Fragment key={article.id}>
                        <Link href={`/articles/${article.titleSlug}`}>
                            <HorizontalCard
                                title={article.title || "-"}
                                imageURL={article.imageURL || DummyImg}
                                authorName={article.authorName || "Unknown Author"}
                                publishDate={article.publishDate}
                                content={article.content || "-"}
                            />
                        </Link>
                    </React.Fragment>
                ))}
            </div>

            {showViewMoreButton && (
                <div className="flex justify-end items-end mt-6">
                    <button className="uppercase text-primary-900 transition-colors duration-300 hover:text-yellow-500 font-bold text-sm xl:block hidden font-century-gothic">
                        VIEW MORE
                    </button>
                    <Button
                        variant="primary"
                        className="xl:hidden block transition-colors duration-300 hover:text-yellow-500 font-century-gothic"
                    >
                        VIEW MORE
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TopStories;
