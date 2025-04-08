"use client";

import React from "react";
import DynamicBlog from "@/components/common/DynamicBlog";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fireServices } from "@/app/services/firestoreService";
import DummyImg from "@/assets/Rectangle-2.png";
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';

interface PageProps {
    params: {
        articleId: string;
    };
    searchParams: {};
}

interface Article {
    id: string;
    authorId: string;
    categoryId: string;
    content: string;
    title?: string;
    publishDate?: any;
    featuredArticle?: boolean;
    imageURL?: string;
    tags?: string;
}

interface Author {
    id: string;
    name: string;
}

const Page = (props: PageProps) => {
    const { articleId } = props?.params;
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [article, setArticle] = React.useState<Article | null>(null);
    const [authorName, setAuthorName] = React.useState<string>('Unknown Author');
    const [formattedDate, setFormattedDate] = React.useState<string>('');

    React.useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if database is available
                if (!db) {
                    throw new Error('Database connection is not available');
                }

                // Fetch article
                const articleRef = doc(db, 'blog/blockchainBriefing/articles', articleId);
                const articleDoc = await getDoc(articleRef);

                if (!articleDoc.exists()) {
                    throw new Error('Article not found');
                }

                const articleData = articleDoc.data() as Article;
                setArticle(articleData);

                // Format date if exists
                if (articleData.publishDate) {
                    try {
                        const date = articleData.publishDate.toDate();
                        setFormattedDate(format(date, 'MMMM d, yyyy'));
                    } catch (dateError) {
                        console.error('Error formatting date:', dateError);
                    }
                }

                // Fetch author if exists
                if (articleData.authorId) {
                    try {
                        const authorRef = doc(db, 'authors', articleData.authorId);
                        const authorDoc = await getDoc(authorRef);
                        
                        if (authorDoc.exists()) {
                            const authorData = authorDoc.data() as Author;
                            setAuthorName(authorData.name);
                        }
                    } catch (authorError) {
                        console.error('Error fetching author:', authorError);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching article:', error);
                let errorMessage = 'Failed to load article. Please try again later.';
                
                if (error instanceof Error) {
                    if (error.message.includes('Database connection')) {
                        errorMessage = 'Unable to connect to the database. Please try again later.';
                    } else if (error.message.includes('Article not found')) {
                        errorMessage = 'The requested article could not be found.';
                    } else if (error.message.includes('permission-denied')) {
                        errorMessage = 'You do not have permission to view this article.';
                    }
                }
                
                setError(errorMessage);
                setLoading(false);
            }
        };

        fetchArticle();
    }, [articleId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <div className="bg-gray-100 p-6 rounded-lg max-w-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <div className="bg-gray-100 p-6 rounded-lg max-w-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Article Not Found</h2>
                    <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <DynamicBlog
            mainHeading="Articles"
            title={article.title || '-'}
            imageURL={article.imageURL || DummyImg}
            authorName={authorName}
            publishDate={formattedDate || null}
            content={article.content || '-'}
        />
    );
};

export default Page;
