"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoIosClose, IoIosSearch } from "react-icons/io";
import { fireServices } from "@/app/services/firestoreService";
import { ArticleWithDetails } from "@/app/services/firestoreService";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Search } from "lucide-react";

interface SearchResult extends ArticleWithDetails {
  categoryName: string;
  createdAt?: string;
}

interface SearchbarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ isOpen, onClose }) => {
  const pathName = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Clear search when modal is closed
      setSearchTerm("");
      setSearchResults([]);
      setError(null);
    }
  }, [isOpen]);

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


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  console.log(searchResults)


  return (
    <section className="px-generic w-full flex justify-center items-center z-50">
      <div className="">
        <div
          className="fixed mx-4 sm:mx-0 inset-0 flex justify-center items-center z-50 animate-fadeIn"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-lg p-6 w-[770px] max-[800px]:w-[660px] shadow-2xl max-w-full animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Search News</h2>
              <button
                aria-label="Close search"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Search Input */}
            <div className="bg-white rounded-md border border-gray-300 py-2 w-full px-5 gap-1 flex justify-center items-center">
              <input
                type="text"
                className="bg-transparent border-none focus:outline-none text-black font-bold font-century-gothic text-[16px] not-italic capitalize  leading-normal w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search news..."
                autoFocus
              />
              {searchTerm ? (
                <button onClick={handleClear} className="text-white hover:text-gray-200">
                  <IoIosClose color="white" size={25} />
                </button>
              ) : (
                <IoIosSearch color="white" size={25} />
              )}
            </div>

            {/* Loading, Error, Results */}
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
              <div className="mt-4 max-h-60 overflow-y-auto">
                <p className="font-century-gothic text-[#020617]">Search for "{searchTerm}"</p>
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
                          onClose();
                        }}
                      >
                        <li className="mb-2 p-2 space-y-2 hover:border-l-[5px] border-[#1E3D5A] hover:bg-[#E2EDF3] rounded cursor-pointer">
                          <h4 className="font-semibold font-century-gothic text-[14px]">{article.title}</h4>
                          <p className="text-sm text-gray-600 capitalize space-x-2">
                            <span className="border border-[#1E3D5A] px-2">
                              Category: {article.categoryName}
                            </span>
                            <span className="border border-[#1E3D5A] px-2">
                              {article?.createdAt
                                ? new Date(article.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                                : ""}
                            </span>
                          </p>
                        </li>
                      </Link>
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
            box-shadow: 0 0 0 rgba(0, 0, 0, 0);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease forwards;
        }
      `}</style>
    </section>
  );
};

export default Searchbar;
