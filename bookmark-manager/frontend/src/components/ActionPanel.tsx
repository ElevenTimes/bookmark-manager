"use client";

import React, { useState, useRef } from "react";
import { BookmarkType } from "./Bookmark";
import { sort } from "./functions/Sort";
import { KeywordType, createKeyword } from "./Keyword";
import ClickOutside from "./hooks/ClickOutside";

import { ChevronDown, ChevronUp } from "lucide-react";

type ActionPanelProps = {
  onAddBookmark: (link: string, description: string, keywords: KeywordType[]) => void;
  bookmarks: BookmarkType[];
  setBookmarks: React.Dispatch<React.SetStateAction<BookmarkType[]>>;
  setSearchQuery: (query: string) => void;
  keywords: KeywordType[];
  setKeywords: React.Dispatch<React.SetStateAction<KeywordType[]>>;
  searchSelectedKeywords: KeywordType[];
  setSearchSelectedKeywords: React.Dispatch<React.SetStateAction<KeywordType[]>>;
};

export default function ActionPanel({
  onAddBookmark,
  bookmarks,
  setBookmarks,
  setSearchQuery,
  keywords,
  setKeywords,
  searchSelectedKeywords,
  setSearchSelectedKeywords,
}: ActionPanelProps) {
  const [isSorting, setIsSorting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<"link" | "description" | "date" | null>(null);

  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<KeywordType[]>([]);

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLDivElement>(null);
  const addKeywordRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSort = (criteria: "link" | "description" | "date") => {
    const sorted = sort(bookmarks, criteria, sortOrder);
    setBookmarks(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortField(criteria);
    setIsSorting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;
    onAddBookmark(link, description, selectedKeywords);
    setLink("");
    setDescription("");
    setSelectedKeywords([]);
    setIsAdding(false);
  };

  const handleCreateKeyword = () => {
    if (!newKeyword.trim()) return;
    const keyword = createKeyword(newKeyword);
    setKeywords((prev) => [...prev, keyword]);
    setNewKeyword("");
  };

  const toggleSearchKeyword = (keyword: KeywordType) => {
    setSearchSelectedKeywords((prev) =>
      prev.some((kw) => kw.id === keyword.id)
        ? prev.filter((kw) => kw.id !== keyword.id)
        : [...prev, keyword]
    );
  };

  const handleKeywordClick = (keyword: KeywordType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent onBlur from firing
    toggleSearchKeyword(keyword);
  };

  // Handle focus and blur on search input
  const handleFocus = () => {
    setIsSearchFocused(true);
  };

  const handleBlur = () => {
    // Only trigger blur if search input is no longer focused
    setTimeout(() => {
      if (!searchInputRef.current?.contains(document.activeElement)) {
        setIsSearchFocused(false); // Close the keyword box if focus is lost
      }
    }, 100); // Delay to ensure keyword click is handled first
  };
  

  ClickOutside(sortRef, () => setIsSorting(false));
  ClickOutside(addRef, () => setIsAdding(false));
  ClickOutside(addKeywordRef, () => setIsAddingKeyword(false));

  return (
    <div className="h-auto p-4 border-b-2 border-[var(--border)] flex justify-between items-start relative flex-col sm:flex-row sm:items-start">
      {/* Sort Button */}
      <div ref={sortRef} className="relative mb-4 sm:mb-0">
        <button
          onClick={() => setIsSorting(!isSorting)}
          className="w-24 bg-[var(--primary)] text-[var(--primary-foreground)] p-2 rounded hover:brightness-120"
        >
          Sort by
        </button>

        {isSorting && (
          <div className="absolute top-full left-0 mt-1 w-40 bg-[var(--background)] border border-[var(--border)] shadow-md rounded-md p-2 z-50">
            {["link", "description", "date"].map((field) => (
              <button
                key={field}
                onClick={() => handleSort(field as any)}
                className="w-full text-left text-sm p-2 hover:bg-[var(--secondary-background)] rounded flex justify-between items-center"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {sortField === field && (sortOrder === "desc" ? <ChevronDown size={16} /> : <ChevronUp size={16} />)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Side Panel */}
      <div className="flex flex-col items-end w-full sm:w-auto">
        <div className="flex flex-row mb-2">
          {/* Add Keyword */}
          <div ref={addKeywordRef} className="relative w-40 pr-2">
            <button
              onClick={() => setIsAddingKeyword(!isAddingKeyword)}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] p-2 rounded hover:brightness-120 w-full"
            >
              Add keyword
            </button>

            {isAddingKeyword && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-[var(--background)] border border-[var(--border)] shadow-md rounded-md p-4 z-50">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateKeyword();
                  }}
                  className="flex flex-col gap-2"
                >
                  <input
                    type="text"
                    placeholder="New keyword"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    className="border p-2 rounded border-white bg-[var(--input-field)] text-black w-full"
                    required
                    maxLength={30}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-[var(--secondary)] text-[var(--primary-foreground)] p-2 rounded hover:brightness-120 flex-1"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingKeyword(false)}
                      className="bg-red-500 text-[var(--primary-foreground)] p-2 rounded hover:brightness-120"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <div className="flex flex-wrap gap-2 mt-8 max-w-full">
                  {keywords.length > 0 ? (
                    keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-[var(--background)] text-[var(--primary-foreground)] text-sm px-2 py-1 rounded max-w-32 break-words text-center"
                        style={{ outline: `2px solid var(--primary)` }}
                      >
                        {keyword.keyword}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No keywords yet</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Add Bookmark */}
          <div ref={addRef} className="relative w-40">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-[var(--secondary)] text-[var(--primary-foreground)] p-2 rounded hover:brightness-120 w-full"
            >
              Add Bookmark
            </button>

            {isAdding && (
              <div className="absolute top-full right-0 mt-1 w-80 bg-[var(--background)] border border-[var(--border)] shadow-md rounded-md p-4 z-50">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="border p-2 rounded border-white bg-[var(--input-field)] text-black w-full"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded border-white bg-[var(--input-field)] text-black w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-[var(--secondary)] text-[var(--primary-foreground)] p-2 rounded hover:brightness-120 flex-1"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="bg-red-500 text-[var(--primary-foreground)] p-2 rounded hover:brightness-120"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <div className="flex flex-wrap gap-2 mt-8 max-w-full">
                  {keywords.length > 0 ? (
                    keywords.map((keyword) => (
                      <button
                        key={keyword.id}
                        onClick={() =>
                          setSelectedKeywords((prev) =>
                            prev.some((kw) => kw.id === keyword.id)
                              ? prev.filter((kw) => kw.id !== keyword.id)
                              : [...prev, keyword]
                          )
                        }
                        className={`text-sm px-2 py-1 rounded max-w-32 break-words text-center ${
                          selectedKeywords.some((kw) => kw.id === keyword.id)
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--background)] text-[var(--primary-foreground)]"
                        }`}
                        style={{ outline: `2px solid var(--primary)` }}
                      >
                        {keyword.keyword}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No keywords yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={searchInputRef}
            className="border p-2 rounded border-white bg-[var(--input-field)] text-black w-80"
          />

          {/* Keyword Filter Box (only shown when search is focused) */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 mt-1 w-80 bg-[var(--background)] border border-[var(--border)] shadow-md rounded-md p-4 z-50">
              <div className="flex flex-wrap gap-2 max-w-full">
                {keywords.map((keyword) => (
                  <button
                    key={keyword.id}
                    onClick={(e) => handleKeywordClick(keyword, e)} // Use the new click handler
                    className={`text-sm px-2 py-1 rounded max-w-32 break-words text-center ${
                      searchSelectedKeywords.some((kw) => kw.id === keyword.id)
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--background)] text-[var(--primary-foreground)]"
                    }`}
                    style={{ outline: `2px solid var(--primary)` }}
                  >
                    {keyword.keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



