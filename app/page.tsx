"use client"
import TopStories from "@/components/topStories/TopStories";
import Image from "next/image";
import DummyImage from "@/assets/Rectangle-2.png";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { formatedDate } from '@/lib/utils';
import Link from "next/link";

interface Article {
    id: string;
    title: string;
    content: string;
    imageURL?: string;
    author: string;
    date: any;
}

interface SocialMedia {
    icon: React.ReactNode;
    link: string;
}

const SocialMediaTag = ({ icon, link }: SocialMedia) => {
    return (
        <div className="rounded-full border border-primary-500 p-2 cursor-pointer">
            {icon}
        </div>
    );
};

const socialMediaArray = [
    {
        icon: <FaTwitter className="text-primary-500" size={20} />,
        link: "",
    },
    {
        icon: <FaFacebookSquare className="text-primary-500" size={20} />,
        link: "",
    },
];

export default function Home() {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if database is available
            if (!db) {
                throw new Error('Database connection is not available');
            }

            // Fetch articles from the articles collection
            const articlesRef = collection(db, 'blog/blockchainBriefing/articles');
            console.log('Fetching articles from:', 'blog/blockchainBriefing/articles');
            
            const articlesSnapshot = await getDocs(articlesRef);
            console.log('Raw articles data:', articlesSnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })));
            
            if (articlesSnapshot.empty) {
                console.log('No articles found in the collection');
                setError('No articles available at the moment.');
                setLoading(false);
                return;
            }

            // Get the first article
            const firstArticleDoc = articlesSnapshot.docs[0];
            const articleData = firstArticleDoc.data() as Article;
            
            setArticle({
                ...articleData,
                id: firstArticleDoc.id,
                date: formatedDate(articleData.date)
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching article:', error);
            setError('Failed to load article. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticle();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button
                    onClick={fetchArticle}
                    className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                <p className="text-gray-500 text-lg">No article found.</p>
            </div>
        );
    }

    return (
        <section className="flex gap-9 max-xl:flex-col w-full">
            <div className="xl:w-[644px] max-w-full">
                <div className="space-y-3 mb-4">
                    <Link href={`/articles/${article.id}`}>
                        <h1 className="font-century-schoolbook text-3xl capitalize px-sm-generic max-md:text-center hover:text-primary-500 transition-colors">
                            {article.title}
                        </h1>
                    </Link>

                    <Image
                        src={article.imageURL || DummyImage}
                        alt="Description of image"
                        width={1200}
                        height={800}
                        quality={100}
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="flex items-center text-lg max-sm:text-xs gap-2 px-sm-generic">
                        <hr className="w-6 h-1" />
                        <h6 className="capitalize">{article.author}</h6>
                        <span className="text-primary-500">|</span>
                        <p className="text-primary-500 italic">{article.date}</p>
                    </div>
                </div>
                <article className="space-y-2 capitalize text-justify md:text-lg text-base px-sm-generic">
                    <p>{article.content}</p>
                </article>

                <div className="my-10 max-md:flex max-md:flex-col max-md:items-center max-md:justify-center">
                    <p className="font-bold mb-2">Share This:</p>
                    <div className="flex gap-4">
                        {socialMediaArray.map((item, index) => (
                            <SocialMediaTag key={index} {...item} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="xl:w-[520px]">
                <TopStories />
            </div>
        </section>
    );
}
