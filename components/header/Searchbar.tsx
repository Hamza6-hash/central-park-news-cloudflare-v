"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoIosClose, IoIosSearch } from "react-icons/io";
import { fireServices } from "@/app/services/firestoreService";
import { ArticleWithDetails } from "@/app/services/firestoreService";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface SearchResult extends ArticleWithDetails {
    categoryName: string;
}

const Searchbar = () => {
    const pathName = usePathname();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim() !== "") {
                handleSearch();
            } else {
                setSearchResults([]);
                setError(null);
            }
        }, 150); 

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearch = async () => {
        setIsSearching(true);
        setError(null);

        try {
            const normalizedSearchTerm = searchTerm.toLowerCase().trim();
            const results = await fireServices.searchArticles(normalizedSearchTerm);

            const categoriesRef = collection(db, "blog/blockchainBriefing/categories");
            const categoriesSnapshot = await getDocs(categoriesRef);
            const categoriesMap = new Map<string, string>();

            categoriesSnapshot.forEach((doc) => {
                const categoryData = doc.data();
                if (categoryData.id && categoryData.name) {
                    categoriesMap.set(categoryData.id, categoryData.name);
                }
            });

            const processedResults = results.map((article) => {
                const categoryName = categoriesMap.get(String(article.categoryId)) || "N/A";
                return { ...article, categoryName } as SearchResult;
            });

            const filteredResults = processedResults.filter((article) =>
                article.title.toLowerCase().includes(normalizedSearchTerm)
            );

            if (filteredResults.length === 0) {
                setError("No articles found matching your search.");
            } else {
                setError(null);
            }
            setSearchResults(filteredResults);
        } catch (error) {
            setError("Failed to search articles. Please try again.");
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = () => {
        setSearchTerm("");
        setSearchResults([]);
        setError(null);
    };

    return (
        <section className="pt-[83px] px-generic w-full flex justify-center items-center">
            <div className="w-[1200px]">
                <div className="flex justify-center items-center w-full">
                    <div className="bg-blue-gradient rounded-full py-2 sm:w-fit w-full px-5 gap-1 flex justify-center items-center">
                        <input
                            type="text"
                            className="bg-transparent border-none focus:outline-none text-[#BFD3E3] font-century-gothic text-[16px] not-italic font-[400] leading-normal sm:w-96 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search articles..."
                        />
                        {searchTerm ? (
                            <button
                                onClick={handleClear}
                                className="text-white hover:text-gray-200"
                            >
                                <IoIosClose color="white" size={25} />
                            </button>
                        ) : (
                            <IoIosSearch color="white" size={25} />
                        )}
                    </div>
                </div>
                {isSearching && (
                    <div className="mt-4 text-center">
                        <p className="text-gray-600">Searching...</p>
                    </div>
                )}
                {error && (
                    <div className="mt-4 text-center">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}
                {searchResults.length > 0 && (
                    <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
                        <h3 className="text-lg font-bold mb-2">Search Results:</h3>
                        <ul>
                            {searchResults.map((article) => (
                                <React.Fragment key={article.id}>
                                    <Link
                                        href={
                                            article.type === "news"
                                                ? `/news/${article.titleSlug}`
                                                : `/articles/${article.titleSlug}`
                                        }
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSearchResults([]);
                                            setError(null);
                                        }}
                                    >
                                        <li className="mb-2 p-2 hover:bg-gray-50 rounded">
                                            <h4 className="font-semibold">{article.title}</h4>
                                            <p className="text-sm text-gray-600 capitalize">
                                                Category: {article.categoryName} | Author:{" "}
                                                {article.author?.author_name || "N/A"}
                                            </p>
                                        </li>
                                    </Link>
                                </React.Fragment>
                            ))}
                        </ul>
                    </div>
                )}

                {pathName === "/" && (
                    <div className="w-full flex md:items-start items-center flex-col">
                        <div className="py-2 px-4 mt-12 font-bold bg-yellow-500 font-century-schoolbook rounded-full w-fit">
                            <p>TODAY'S TOP STORY</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Searchbar;
