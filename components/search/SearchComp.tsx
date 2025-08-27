"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  authorName: string;
  createdAt: string;
  titleSlug: string;
  type: string;
  category_name?: string;
}

interface SearchbarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ isOpen, onClose, onOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMacOS, setIsMacOS] = useState(false);

  useEffect(() => {
    const isMac = () => navigator.platform.toUpperCase().includes("MAC");
    setIsMacOS(isMac());
  }, []);

  // keyboard shortcut logic
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();

        if (isOpen) {
          onClose();
        } else if (onOpen) {
          onOpen();
        }
      }

      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onOpen]);

  useEffect(() => {
    if (!isOpen) {
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
    }, 300); // Increased debounce time for better performance

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchTerm.trim())}&limit=10`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
        setError(null);
      } else {
        setSearchResults([]);
        setError("No articles found matching your search.");
      }
    } catch (error) {
      console.error('Search error:', error);
      setError("Failed to search articles. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <section className="px-generic w-full flex justify-center items-center z-50">
      <div className="">
        <div
          className="fixed mx-4 sm:mx-0 inset-0 flex justify-center items-center z-50 animate-fadeIn"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-xl p-[12px] w-[770px] max-[800px]:w-[660px] shadow-2xl max-w-full animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Search Input */}
            <div className="bg-white rounded-lg border border-gray-300 py-2 w-full px-5 flex justify-between items-center">
              <div className="flex items-center gap-2 flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>

                <input
                  type="text"
                  className="bg-transparent border-none focus:outline-none text-black font-century-gothic text-[16px] font-bold w-full placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                />
              </div>

              <span className="text-gray-400 text-xs font-medium whitespace-nowrap ml-4">
                {isMacOS ? "⌘ + S" : "CTRL + S"}
              </span>
            </div>

            {/* Loading, Error, Results */}
            {isSearching && (
              <div className="mt-2 px-2">
                <p className="font-century-gothic text-[#b2b3b6]">Searching..</p>
              </div>
            )}
            {searchTerm && !isSearching && (
              <div className="mt-2 px-2">
                <p className="font-century-gothic text-[#b2b3b6]">
                  Search for &quot;{searchTerm}&quot;
                </p>
              </div>
            )}
            {error && (
              <div className="mt-4 text-center">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-4 max-h-60 overflow-y-auto scrollbar-hide">
                <ul>
                  {searchResults.map((article) => (
                    <React.Fragment key={article.id}>
                      <Link
                        href={`/news/${article.titleSlug}`}
                        onClick={() => {
                          setSearchTerm("");
                          setSearchResults([]);
                          setError(null);
                          onClose();
                        }}
                      >
                        <li className="mb-2 p-2 space-y-2 hover:border-l-[5px] border-[#1E3D5A] hover:bg-[#E2EDF3] rounded cursor-pointer">
                          <h4 className="font-semibold font-century-gothic text-[#224667] text-[14px]">{article.title}</h4>
                          <p className="text-sm text-[#224667] capitalize space-x-2">
                            <span className="border border-[#1E3D5A] px-2 text-[#224667] rounded-md">
                              {article.category_name || "Local News"}
                            </span>
                            <span className="border text-[#224667] border-[#1E3D5A] px-2 rounded-md">
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
