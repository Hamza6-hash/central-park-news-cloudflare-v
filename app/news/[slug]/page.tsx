"use client";

import React, { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { generateSlug } from "@/lib/utils";
import DynamicBlog from "@/components/common/DynamicBlog";
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";

interface News {
    id: string;
    title: string;
    content: string;
    imageURL?: string;
    authorId: string;
    authorName?: string;
    date: {
        seconds: number;
        nanoseconds: number;
    };
    formattedDate?: string;
    titleSlug?: string;
}

export default function NewsPage({ params }: { params: { slug: string } }) {
    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchNews = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching news with slug:', params.slug);

            // Check if database is available
            if (!db) {
                throw new Error('Database connection is not available');
            }

            // Get all news items that match this title slug
            const newsRef = collection(db, 'blog/blockchainBriefing/newsletter');
            const querySnapshot = await getDocs(newsRef);
            
            let matchingNews = [];
            const requestedSlug = params.slug;
            const baseSlug = requestedSlug.replace(/-\d+$/, ''); // Remove any trailing numbers
            const requestedNumber = requestedSlug.match(/-(\d+)$/)?.[1]; // Get the number if present

            // Find all news items with the same base title
            for (const doc of querySnapshot.docs) {
                const data = doc.data() as News;
                const newsBaseSlug = data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                if (newsBaseSlug === baseSlug) {
                    matchingNews.push({
                        doc,
                        data,
                        date: data.date
                    });
                }
            }

            let newsDoc;
            let newsData;

            if (matchingNews.length > 0) {
                // Sort by date (oldest first to maintain consistent numbering)
                matchingNews.sort((a, b) => a.date.seconds - b.date.seconds);
                
                if (requestedNumber) {
                    // If a specific number was requested (e.g., ai-world-2), get that news item
                    const index = parseInt(requestedNumber) - 1;
                    if (index >= 0 && index < matchingNews.length) {
                        newsDoc = matchingNews[index].doc;
                        newsData = matchingNews[index].data;
                    } else {
                        // If the requested number is out of range, redirect to 404
                        console.log('News number out of range:', requestedNumber);
                        router.push('/404');
                        return;
                    }
                } else {
                    // No number in URL, get the first/oldest news item
                    newsDoc = matchingNews[0].doc;
                    newsData = matchingNews[0].data;
                }
            } else {
                // If no matching news items found, redirect to 404
                console.log('No news items found with base slug:', baseSlug);
                router.push('/404');
                return;
            }

            // If not found by slug, try to find by ID (for backward compatibility)
            if (!newsDoc) {
                console.log('Trying to find news by ID:', params.slug);
                const newsRef = doc(db, 'blog/blockchainBriefing/newsletter', params.slug);
                const newsSnap = await getDoc(newsRef);
                
                if (newsSnap.exists()) {
                    newsDoc = newsSnap;
                    newsData = newsSnap.data() as News;
                    console.log('News found by ID:', newsData.title);
                } else {
                    console.log('News not found by either slug or ID');
                    router.push('/404');
                    return;
                }
            }

            if (!newsData) {
                throw new Error('News data is missing');
            }

            // Get author name from authors collection
            console.log('Fetching author name for ID:', newsData.authorId);
            const authorDoc = await getDoc(doc(db, 'blog/blockchainBriefing/authors', newsData.authorId));
            const authorName = authorDoc.exists() ? authorDoc.data().author_name : 'Unknown Author';
            console.log('Author name:', authorName);
            
            // Format the date
            let formattedDate = 'Unknown Date';
            if (newsData.date) {
                try {
                    // Convert Firestore timestamp to JavaScript Date
                    const timestamp = newsData.date;
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

            // If news item doesn't have a slug, generate and update it
            if (!newsData.titleSlug && newsDoc) {
                console.log('Generating new slug for news');
                const slug = generateSlug(newsData.title, newsDoc.id);
                await updateDoc(newsDoc.ref, { titleSlug: slug });
                newsData.titleSlug = slug;
                console.log('New slug generated:', slug);
            }
            
            const newsItem: News = {
                ...newsData,
                id: newsDoc.id,
                authorName: authorName,
                formattedDate: formattedDate
            };
            
            setNews(newsItem);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching news:', error);
            setError('Failed to fetch news');
            setLoading(false);
        }
    }, [params.slug, router]);

    useEffect(() => {
        fetchNews();
    }, [params.slug, fetchNews]);

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

    if (!news) {
        return null; // The router will handle the 404 redirect
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <DynamicBlog
                title={news.title}
                imageURL={news.imageURL || '/images/default-news.jpg'}
                authorName={news.authorName || 'Unknown Author'}
                publishDate={news.date}
                content={news.content}
                titleSlug={news.titleSlug}
                isArticlePage={false}
                mainHeading="News"
            />
        </div>
    );
} 