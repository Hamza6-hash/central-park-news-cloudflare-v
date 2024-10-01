"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { fireServices } from "@/app/services/firestoreService";
import { ArticleWithDetails } from "@/app/services/firestoreService"; // Make sure to export this interface

const Searchbar = () => {
    const pathName = usePathname();
    // const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<ArticleWithDetails[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (searchTerm.trim() === "") {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const results = await fireServices.searchArticles(searchTerm);
            setSearchResults(results);
        } catch (error) {
            console.error("Error searching articles:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <section className="pt-[83px] px-generic w-full flex justify-center items-center">
            <div className="w-[1200px]">
                <div className="flex justify-center items-center w-full">
                    <div className="bg-blue-gradient rounded-full py-2 sm:w-fit w-full px-5 gap-1 flex justify-center items-center">
                        <input
                            type="text"
                            className="bg-transparent border-none focus:outline-none sm:w-96 text-white w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search articles..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} disabled={isSearching}>
                            <IoIosSearch color="white" size={25} />
                        </button>
                    </div>
                </div>
                {searchResults.length > 0 && (
                    <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
                        <h3 className="text-lg font-bold mb-2">Search Results:</h3>
                        <ul>
                            {searchResults.map((article) => (
                                <li key={article.id} className="mb-2">
                                    <h4 className="font-semibold">{article.title}</h4>
                                    <p className="text-sm text-gray-600">
                                        Category: {article.category?.name || 'N/A'} |
                                        Author: {article.author?.name || 'N/A'}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {pathName === '/' && (
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
