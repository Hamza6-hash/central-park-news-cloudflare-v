"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { fireServices } from "@/app/services/firestoreService";
import { ArticleWithDetails, } from "@/app/services/firestoreService";
import Link from "next/link";

interface SearchResult extends ArticleWithDetails {
  createdAt?: string;
  category: string;
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

  // Use ref to track current search term to avoid stale closures
  const currentSearchTermRef = useRef("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const isMac = () => navigator.platform.toUpperCase().includes("MAC");
    setIsMacOS(isMac());
  }, []);

  // Keyboard shortcut logic
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

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSearchResults([]);
      setError(null);
      setIsSearching(false);
      currentSearchTermRef.current = "";

      // Clear any pending searches
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    }
  }, [isOpen]);

  const handleSearch = useCallback(async (term: string) => {
    // Don't search if term is empty or component is not open
    if (!term.trim() || !isOpen) {
      setSearchResults([]);
      setError(null);
      setIsSearching(false);
      return;
    }

    const normalizedSearchTerm = term.toLowerCase().trim();

    // Check if this search is still relevant
    if (normalizedSearchTerm !== currentSearchTermRef.current.toLowerCase().trim()) {
      return; // This search is outdated, ignore it
    }

    setIsSearching(true);
    setError(null);

    try {
      const results = await fireServices.searchArticles(normalizedSearchTerm);

      // Double-check if search is still relevant after async operation
      if (normalizedSearchTerm !== currentSearchTermRef.current.toLowerCase().trim()) {
        return; // Search term changed while we were searching, ignore results
      }

      // More comprehensive search - check title, content, and category
      const filteredResults = results.filter((article) => {
        const titleMatch = article.title.toLowerCase().includes(normalizedSearchTerm);
        const contentMatch = article.content?.toLowerCase().includes(normalizedSearchTerm);
        const categoryMatch = article.category?.toLowerCase().includes(normalizedSearchTerm);

        return titleMatch || contentMatch || categoryMatch;
      });

      if (filteredResults.length === 0) {
        setError("No articles found matching your search.");
        setSearchResults([]);
      } else {
        setError(null);
        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError("Failed to search articles. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [isOpen]);

  // Debounced search effect
  useEffect(() => {
    // Update the current search term ref
    currentSearchTermRef.current = searchTerm;

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If search term is empty, clear results immediately
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setError(null);
      setIsSearching(false);
      return;
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300); // Increased debounce time for better UX

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, handleSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleResultClick = useCallback(() => {
    setSearchTerm("");
    setSearchResults([]);
    setError(null);
    setIsSearching(false);
    onClose();
  }, [onClose]);

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
                  className={`w-5 h-5 transition-colors ${isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`}
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
                  placeholder="Search articles, news, and topics..."
                  autoFocus
                />
              </div>

              <span className="text-gray-400 text-xs font-medium whitespace-nowrap ml-4">
                {isMacOS ? "⌘ + S" : "CTRL + S"}
              </span>
            </div>

            {/* Status Messages */}
            {isSearching && (
              <div className="mt-2 px-2">
                <p className="font-century-gothic text-[#b2b3b6] flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Searching...
                </p>
              </div>
            )}

            {searchTerm && !isSearching && searchResults.length === 0 && !error && (
              <div className="mt-2 px-2">
                <p className="font-century-gothic text-[#b2b3b6]">
                  Search for "{searchTerm}"
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 px-2">
                <p className="text-red-500 text-sm font-century-gothic">{error}</p>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 max-h-80 overflow-y-auto scrollbar-hide">
                <div className="px-2 mb-2">
                  <p className="text-sm text-gray-600 font-century-gothic">
                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <ul>
                  {searchResults.map((article) => (
                    <React.Fragment key={article.id}>
                      <Link
                        href={`/news/${article.titleSlug}`}
                        onClick={handleResultClick}
                      >
                        <li className="mb-2 p-3 space-y-2 hover:border-l-[5px] border-[#1E3D5A] hover:bg-[#E2EDF3] rounded cursor-pointer transition-all duration-200">
                          <h4 className="font-semibold font-century-gothic text-[#224667] text-[14px] line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="border border-[#1E3D5A] px-2 py-1 text-[#224667] rounded-md text-xs capitalize">
                              {article.category || 'Local News'}
                            </span>
                            {article?.createdAt && (
                              <span className="border text-[#224667] border-[#1E3D5A] px-2 py-1 rounded-md text-xs">
                                {new Date(article.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            )}
                            <span className="text-xs text-gray-500 capitalize">
                              {article.type}
                            </span>
                          </div>
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