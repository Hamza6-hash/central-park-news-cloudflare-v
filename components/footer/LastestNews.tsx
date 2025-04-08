import React, { useRef, useState } from "react";
import VerticalCard from "../common/VerticalCard";
import { GoArrowRight } from "react-icons/go";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fireServices } from "@/app/services/firestoreService";
import DummyImg from "@/assets/Rectangle-4.png";
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { formatedDate } from '@/lib/utils';

interface News {
    id: string;
    title: string;
    content: string;
    imageURL?: string;
    author: string;
    date: any;
}

const LastestNews = () => {
    const [limit, setLimit] = useState(5);
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if database is available
            if (!db) {
                throw new Error('Database connection is not available');
            }

            // Fetch news from the newsletter collection
            const newsRef = collection(db, 'blog/blockchainBriefing/newsletter');
            console.log('Fetching news from:', 'blog/blockchainBriefing/newsletter');
            
            const newsSnapshot = await getDocs(newsRef);
            console.log('Raw news data:', newsSnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })));
            
            if (newsSnapshot.empty) {
                console.log('No news found in the collection');
                setError('No news available at the moment.');
                setLoading(false);
                return;
            }

            // Process news
            const processedNews = newsSnapshot.docs.map((newsDoc) => {
                const newsData = newsDoc.data() as News;
                return {
                    ...newsData,
                    id: newsDoc.id,
                    date: formatedDate(newsData.date)
                };
            });

            setNews(processedNews);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching news:', error);
            setError('Failed to load news. Please try again later.');
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchNews();
    }, []);

    const productContainerRef = useRef<HTMLDivElement>(null);

    const slideLeft = () => {
        if (productContainerRef.current) {
            productContainerRef.current.scrollLeft -= 230;
        }
    };

    const slideRight = () => {
        if (news && news.length === limit)
            setLimit((prevLimit) => prevLimit + 1);
        if (productContainerRef.current) {
            setLimit((prevLimit) => prevLimit + 1);
            productContainerRef.current.scrollLeft += 230;
        }
    };

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

    if (!news?.length) return null;

    return (
        <section className="lastestNews py-[58px] px-generic">
            <div className="max-width w-full">
                <h1 className="uppercase text-3xl font-bold text-white mb-4">
                    Latest news
                </h1>
                <div className="flex gap-6 items-center justify-between relative w-full mx-auto">
                    <div
                        ref={productContainerRef}
                        className="w-full flex gap-4 overflow-x-scroll hide-scrollbar mx-auto py-1"
                    >
                        {news?.slice(0, limit).map((newsItem, index) => (
                            <React.Fragment key={index}>
                                <VerticalCard
                                    title={newsItem?.title}
                                    imageURL={newsItem?.imageURL ? newsItem.imageURL : DummyImg}
                                    authorName={newsItem?.author || ""}
                                    publishDate={newsItem?.date}
                                    articleId={newsItem?.id}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                    <button
                        className="bg-primary-300 p-2 rounded-full"
                        onClick={slideRight}
                    >
                        <GoArrowRight color="white" size={25} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LastestNews;
