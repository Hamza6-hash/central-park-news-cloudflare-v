"use client";

import React, { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { generateSlug } from "@/lib/utils";
import DynamicBlog from "@/components/common/DynamicBlog";
import { useRouter } from 'next/navigation';
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

export default function ArticlePage({ params }: { params: { slug: string } }) {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchArticle = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching article with slug:', params.slug);

            // Check if database is available
            if (!db) {
                throw new Error('Database connection is not available');
            }

            // Get all articles that match this title slug
            const articlesRef = collection(db, 'blog/blockchainBriefing/articles');
            const querySnapshot = await getDocs(articlesRef);
            
            let matchingArticles = [];
            const requestedSlug = params.slug;
            const baseSlug = requestedSlug.replace(/-\d+$/, ''); // Remove any trailing numbers
            const requestedNumber = requestedSlug.match(/-(\d+)$/)?.[1]; // Get the number if present

            // Find all articles with the same base title
            for (const doc of querySnapshot.docs) {
                const data = doc.data() as Article;
                const articleBaseSlug = data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                if (articleBaseSlug === baseSlug) {
                    matchingArticles.push({
                        doc,
                        data,
                        publishDate: data.publishDate
                    });
                }
            }

            let articleDoc;
            let articleData;

            if (matchingArticles.length > 0) {
                // Sort by publish date (oldest first to maintain consistent numbering)
                matchingArticles.sort((a, b) => a.publishDate.seconds - b.publishDate.seconds);
                
                if (requestedNumber) {
                    // If a specific number was requested (e.g., ai-world-2), get that article
                    const index = parseInt(requestedNumber) - 1;
                    if (index >= 0 && index < matchingArticles.length) {
                        articleDoc = matchingArticles[index].doc;
                        articleData = matchingArticles[index].data;
                    } else {
                        // If the requested number is out of range, redirect to 404
                        console.log('Article number out of range:', requestedNumber);
                        router.push('/404');
                        return;
                    }
                } else {
                    // No number in URL, get the first/oldest article
                    articleDoc = matchingArticles[0].doc;
                    articleData = matchingArticles[0].data;
                }
            } else {
                // If no matching articles found, redirect to 404
                console.log('No articles found with base slug:', baseSlug);
                router.push('/404');
                return;
            }

            // If not found by slug, try to find by ID (for backward compatibility)
            if (!articleDoc) {
                console.log('Trying to find article by ID:', params.slug);
                const articleRef = doc(db, 'blog/blockchainBriefing/articles', params.slug);
                const articleSnap = await getDoc(articleRef);
                
                if (articleSnap.exists()) {
                    articleDoc = articleSnap;
                    articleData = articleSnap.data() as Article;
                    console.log('Article found by ID:', articleData.title);
                } else {
                    console.log('Article not found by either slug or ID');
                    router.push('/404');
                    return;
                }
            }

            if (!articleData) {
                throw new Error('Article data is missing');
            }

            // Get author name from authors collection
            console.log('Fetching author name for ID:', articleData.authorId);
            const authorDoc = await getDoc(doc(db, 'blog/blockchainBriefing/authors', articleData.authorId));
            const authorName = authorDoc.exists() ? authorDoc.data().author_name : 'Unknown Author';
            console.log('Author name:', authorName);
            
            // Format the date
            let formattedDate = 'Unknown Date';
            if (articleData.publishDate) {
                try {
                    // Convert Firestore timestamp to JavaScript Date
                    const timestamp = articleData.publishDate;
                    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                    
                    formattedDate = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    console.log('Formatted date:', formattedDate);
                } catch (error) {
                    console.error('Error formatting date:', error);
                }
            }

            // If article doesn't have a slug, generate and update it
            if (!articleData.titleSlug && articleDoc) {
                console.log('Generating new slug for article');
                const slug = generateSlug(articleData.title, articleDoc.id);
                await updateDoc(articleDoc.ref, { titleSlug: slug });
                articleData.titleSlug = slug;
                console.log('New slug generated:', slug);
            }
            
            const article: Article = {
                ...articleData,
                id: articleDoc.id,
                authorName: authorName,
                date: formattedDate
            };
            
            setArticle(article);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching article:', error);
            setError('Failed to fetch article');
            setLoading(false);
        }
    }, [params.slug, router]);

    useEffect(() => {
        fetchArticle();
    }, [params.slug, fetchArticle]);

    if (loading) {
        return (
            <div className="container mx-auto px-1 py-8">
            {/* // <div className=""> */}
                <div className="space-y-4 w-[90vw] ">
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
        return null; // The router will handle the 404 redirect
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <DynamicBlog
                title={article.title}
                imageURL={article.imageURL || '/images/default-article.jpg'}
                authorName={article.authorName || 'Unknown Author'}
                publishDate={article.publishDate}
                content={article.content}
                titleSlug={article.titleSlug}
                isArticlePage={true}
                mainHeading="Article"
            />
        </div>
    );
} 