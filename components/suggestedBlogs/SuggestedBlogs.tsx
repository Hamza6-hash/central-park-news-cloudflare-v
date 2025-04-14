"use client";

import React from "react";
import BlogsCard from "../common/BlogsCard";
import { routes } from "@/constants";
import { usePathname } from "next/navigation";

const SuggestedBlogs = () => {
    const pathName = usePathname();
    const isActive =
        pathName === routes.articles || pathName.startsWith(`${routes.articles}/`);

    // Mock data for suggested blogs with unique titles
    const suggestedBlogs = [
        {
            title: 'Blockchain Technology: The Future of Digital Transactions',
            content: 'Exploring how blockchain is revolutionizing digital transactions and what it means for the future of finance.',
            publishDate: { seconds: Date.now() / 1000, nanoseconds: 0 },
            imageURL: '/placeholder.jpg',
            titleSlug: 'blockchain-technology-future-digital-transactions',
            type: 'article' as const,
            authorName: 'Tech Analyst'
        },
        {
            title: 'Understanding Smart Contracts: A Comprehensive Guide',
            content: 'A deep dive into smart contracts, their applications, and how they are changing the way we do business.',
            publishDate: { seconds: Date.now() / 1000, nanoseconds: 0 },
            imageURL: '/placeholder.jpg',
            titleSlug: 'understanding-smart-contracts-comprehensive-guide',
            type: 'article' as const,
            authorName: 'Blockchain Expert'
        },
        {
            title: 'The Rise of DeFi: Decentralized Finance Explained',
            content: 'An in-depth look at decentralized finance and its impact on traditional financial systems.',
            publishDate: { seconds: Date.now() / 1000, nanoseconds: 0 },
            imageURL: '/placeholder.jpg',
            titleSlug: 'rise-defi-decentralized-finance-explained',
            type: 'article' as const,
            authorName: 'Finance Specialist'
        },
        {
            title: 'NFTs and Digital Ownership: A New Era of Art',
            content: 'How NFTs are transforming the art world and redefining digital ownership.',
            publishDate: { seconds: Date.now() / 1000, nanoseconds: 0 },
            imageURL: '/placeholder.jpg',
            titleSlug: 'nfts-digital-ownership-new-era-art',
            type: 'article' as const,
            authorName: 'Art Curator'
        }
    ];

    return (
        <div className="bg-primary-700 px-generic md:py-14 py-10 flex items-center justify-center">
            <div className="max-width">
                <h1 className="font-bold text-[32px] text-primary-900 mb-7 uppercase">
                    {isActive ? "BLOGS" : "Articles"}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {suggestedBlogs.map((blog, index) => (
                        <React.Fragment key={index}>
                            <BlogsCard {...blog} />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuggestedBlogs;
