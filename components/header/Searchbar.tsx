"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoIosSearch, IoIosClose } from "react-icons/io";
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
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (searchTerm.trim() === "") {
            setSearchResults([]);
            setError(null);
            return;
        }

        setIsSearching(true);
        setError(null);
        setHasSearched(true);

        try {
            // Convert search term to lowercase for case-insensitive search
            const normalizedSearchTerm = searchTerm.toLowerCase().trim();
            const results = await fireServices.searchArticles(normalizedSearchTerm);
            
            // Fetch categories
            const categoriesRef = collection(db, "blog/blockchainBriefing/categories");
            const categoriesSnapshot = await getDocs(categoriesRef);
            const categoriesMap = new Map<string, string>();
            
            // Log categories for debugging
            // console.log("Categories from Firestore:");
            categoriesSnapshot.forEach(doc => {
                const categoryData = doc.data();
                // console.log("Category data:", {
                //     id: categoryData.id,
                //     name: categoryData.name,
                //     type: typeof categoryData.id
                // });
                // Use the 'id' field as the key and 'name' as the value
                if (categoryData.id && categoryData.name) {
                    categoriesMap.set(categoryData.id, categoryData.name);
                }
            });

            // Process results with category names
            const processedResults = await Promise.all(results.map(async (article) => {
                let categoryName = "N/A";
                if (article.categoryId) {
                    // console.log("Article data:", {
                    //     categoryId: article.categoryId,
                    //     type: typeof article.categoryId,
                    //     title: article.title
                    // });
                    
                    // Convert both IDs to strings for comparison
                    const articleCategoryId = String(article.categoryId);
                    const categoryNameFromMap = categoriesMap.get(articleCategoryId);
                    
                    // console.log("Category lookup:", {
                    //     articleCategoryId,
                    //     availableIds: Array.from(categoriesMap.keys()),
                    //     foundName: categoryNameFromMap
                    // });
                    
                    categoryName = categoryNameFromMap || "N/A";
                }

                return {
                    ...article,
                    categoryName
                } as SearchResult;
            }));

            const filteredResults = processedResults.filter(article => 
                article.title.toLowerCase().includes(normalizedSearchTerm)
            );

            if (filteredResults.length === 0) {
                setError("No articles found matching your search.");
            } else {
                setError(null);
            }
            setSearchResults(filteredResults);
        } catch (error) {
            // console.error("Error searching articles:", error);
            setError("Failed to search articles. Please try again.");
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setSearchResults([]);
        setError(null);
        setHasSearched(false);
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    };

    return (
        <section className="pt-[83px] px-generic w-full flex justify-center items-center">
            <div className="w-[1200px]">
                <div className="flex justify-center items-center w-full">
                    <div className="bg-blue-gradient rounded-full py-2 sm:w-fit w-full px-5 gap-1 flex justify-center items-center">
                        <input
                            type="text"
                            className="bg-transparent border-none focus:outline-none focus sm:w-96 text-white w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search articles..."
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {hasSearched && searchTerm ? (
                            <button 
                                onClick={handleClear}
                                className="text-white hover:text-gray-200"
                            >
                                <IoIosClose color="white" size={25} />
                            </button>
                        ) : (
                            <button 
                                onClick={handleSearch} 
                                disabled={isSearching || !searchTerm.trim()}
                                className="disabled:opacity-50"
                            >
                                <IoIosSearch color="white" size={25} />
                            </button>
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
                                        href={article.type === 'news' 
                                            ? `/news/${article.titleSlug}`
                                            : `/articles/${article.titleSlug}`} 
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSearchResults([]);
                                            setError(null);
                                        }}
                                    >
                                        <li className="mb-2 p-2 hover:bg-gray-50 rounded">
                                            <h4 className="font-semibold">{article.title}</h4>
                                            <p className="text-sm text-gray-600 capitalize">
                                                Category: {article.categoryName} |
                                                Author: {article.author?.author_name || 'N/A'}
                                            </p>
                                        </li>
                                    </Link>
                                </React.Fragment>
                            ))}
                        </ul>
                    </div>
                )}

                {pathName === '/' && (
                    <div className="w-full flex md:items-start items-center flex-col">
                        <div className="py-2 px-4 mt-12 font-bold bg-yellow-500 font-century-schoolbook rounded-full w-fit">
                            <p>TODAYS TOP STORY</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Searchbar;
