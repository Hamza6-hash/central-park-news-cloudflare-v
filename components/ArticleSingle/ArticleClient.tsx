"use client";

import React, { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { generateSlug } from "@/lib/utils";
import DynamicBlog from "@/components/common/DynamicBlog";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

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
    titleSlug?: string;
}

const ArticleClient = ({ slug }: { slug: string }) => {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchArticle = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // console.log("Fetching article with slug:", slug);

            if (!db) {
                throw new Error("Database connection is not available");
            }

            const articlesRef = collection(db, "blog/blockchainBriefing/articles");
            const querySnapshot = await getDocs(articlesRef);

            let matchingArticles = [];
            const baseSlug = slug.replace(/-\d+$/, "");
            const requestedNumber = slug.match(/-(\d+)$/)?.[1];

            for (const doc of querySnapshot.docs) {
                const data = doc.data() as Article;
                const articleBaseSlug = data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                if (articleBaseSlug === baseSlug) {
                    matchingArticles.push({
                        doc,
                        data,
                        publishDate: data.publishDate,
                    });
                }
            }

            let articleDoc;
            let articleData;

            if (matchingArticles.length > 0) {
                matchingArticles.sort((a, b) => a.publishDate.seconds - b.publishDate.seconds);

                if (requestedNumber) {
                    const index = parseInt(requestedNumber) - 1;
                    if (index >= 0 && index < matchingArticles.length) {
                        articleDoc = matchingArticles[index].doc;
                        articleData = matchingArticles[index].data;
                    } else {
                        // console.log("Article number out of range:", requestedNumber);
                        router.push("/404");
                        return;
                    }
                } else {
                    articleDoc = matchingArticles[0].doc;
                    articleData = matchingArticles[0].data;
                }
            } else {
                // console.log("No articles found with base slug:", baseSlug);
                router.push("/404");
                return;
            }

            if (!articleDoc) {
                // console.log("Trying to find article by ID:", slug);
                const articleRef = doc(db, "blog/blockchainBriefing/articles", slug);
                const articleSnap = await getDoc(articleRef);

                if (articleSnap.exists()) {
                    articleDoc = articleSnap;
                    articleData = articleSnap.data() as Article;
                    // console.log("Article found by ID:", articleData.title);
                } else {
                    console.log("Article not found by either slug or ID");
                    router.push("/404");
                    return;
                }
            }

            if (!articleData) {
                throw new Error("Article data is missing");
            }

            const authorDoc = await getDoc(doc(db, "blog/blockchainBriefing/authors", articleData.authorId));
            const authorName = authorDoc.exists() ? authorDoc.data().author_name : "Unknown Author";

            let formattedDate = "Unknown Date";
            if (articleData.publishDate) {
                try {
                    const timestamp = articleData.publishDate;
                    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

                    formattedDate = date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });
                } catch (error) {
                    console.error("Error formatting date:", error);
                }
            }

            if (!articleData.titleSlug && articleDoc) {
                const slug = generateSlug(articleData.title, articleDoc.id);
                await updateDoc(articleDoc.ref, { titleSlug: slug });
                articleData.titleSlug = slug;
            }

            const article: Article = {
                ...articleData,
                id: articleDoc.id,
                authorName: authorName,
                date: formattedDate,
            };

            setArticle(article);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching article:", error);
            setError("Failed to fetch article");
            setLoading(false);
        }
    }, [slug, router]);

    useEffect(() => {
        fetchArticle();
    }, [slug, fetchArticle]);

    if (loading) {
        return (
            <div className="container mx-auto px-1 py-8">
                <div className="space-y-4 w-[90vw]">
                    <Skeleton className="h-8 w-1/2 bg-gray-100" />
                    <Skeleton className="h-[200px] w-full rounded-lg bg-gray-100" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-32 bg-gray-100" />
                        <Skeleton className="h-4 w-4 bg-gray-100" />
                        <Skeleton className="h-4 w-24 bg-gray-100" />
                    </div>
                    <div className="space-y-4 mt-6">
                        {[1, 2, 3, 4, 5].map((index) => (
                            <Skeleton key={index} className="h-4 w-full bg-gray-100" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!article) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <DynamicBlog
                title={article.title}
                imageURL={article.imageURL || "/images/default-article.jpg"}
                authorName={article.authorName || "Unknown Author"}
                publishDate={article.publishDate}
                content={article.content}
                titleSlug={article.titleSlug}
                isArticlePage={true}
                mainHeading="Article"
            />
        </div>
    );
};

export default ArticleClient;