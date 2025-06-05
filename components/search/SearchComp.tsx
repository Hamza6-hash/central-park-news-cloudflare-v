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

  if (!isOpen) return null; // Don't render if modal closed

  return (
    <section className="pt-[10px] px-generic w-full flex justify-center items-center">
      <div className="">
        {/* Modal */}
        <div
          className="fixed mx-4 sm:mx-0 inset-0 flex justify-center items-center z-50 animate-fadeIn"
          onClick={onClose} // Close on clicking backdrop
        >
          <div
            className="bg-white rounded-lg p-6 w-[600px] shadow-2xl max-w-full animate-slideUp"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on clicking inside
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Search Articles</h2>
              <button
                aria-label="Close search"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Search Input */}
            <div className="bg-blue-gradient rounded-full py-2 w-full px-5 gap-1 flex justify-center items-center">
              <input
                type="text"
                className="bg-transparent border-none focus:outline-none text-[#BFD3E3] font-century-gothic text-[16px] not-italic font-[400] leading-normal w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
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
                        <li className="mb-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
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
