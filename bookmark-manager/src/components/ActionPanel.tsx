"use client";

import React, { useState, useEffect, useRef } from "react";
import { BookmarkType } from "./Bookmark"; // Adjust path if needed
import { sort } from "./functions/Sort";
import { KeywordType, createKeyword } from "./Keyword";

type ActionPanelProps = {
  onAddBookmark: (link: string, description: string) => void;
  bookmarks: BookmarkType[];
  setBookmarks: React.Dispatch<React.SetStateAction<BookmarkType[]>>;
  setSearchQuery: (query: string) => void; 
};

export default function ActionPanel({ onAddBookmark, bookmarks, setBookmarks, setSearchQuery}: ActionPanelProps) {
  const [isSorting, setIsSorting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  const [keywords, setKeywords] = useState<KeywordType[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  

  // Refs for detecting clicks outside
  const sortRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLDivElement>(null);
  const addKeywordRef = useRef<HTMLDivElement>(null);


  // Function to handle sorting
  const handleSort = (criteria: "name" | "date") => {
    const sorted = sort(bookmarks, criteria, sortOrder);
    setBookmarks(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setIsSorting(false); // Close the menu after sorting
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;
    onAddBookmark(link, description);
    setLink("");
    setDescription("");
    setIsAdding(false); // Close form after submission
  };

  // Handle adding a keyword
  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return; // Prevent adding empty keywords
    const keyword = createKeyword(newKeyword);
    setKeywords((prev) => [...prev, keyword]);
    setNewKeyword(""); // Clear input field
  };

  // Detect clicks outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortRef.current && !sortRef.current.contains(event.target as Node) &&
        addRef.current && !addRef.current.contains(event.target as Node) &&
        addKeywordRef.current && !addKeywordRef.current.contains(event.target as Node)

      ) {
        setIsSorting(false);
        setIsAdding(false);
        setIsAddingKeyword(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-32 p-4 border-b-2 border-[var(--border)] flex justify-between items-start relative">
      {/* Sort Button on the Left */}
      <div ref={sortRef} className="relative">
        <button 
          onClick={() => setIsSorting(!isSorting)}
          className="w-24 bg-[var(--primary)] text-[var(--primary-foreground)] p-2 rounded hover:brightness-120"
        >
          Sort by
        </button>
  
        {isSorting && (
          <div className="absolute top-full left-0 mt-1 w-40 bg-[var(--background)] border border-[var(--border)] shadow-md rounded-md p-2 z-50">
            <button 
              onClick={() => handleSort("name")} 
              className="block w-full text-left text-sm p-2 hover:bg-[var(--hover)] rounded"
            >
              Name
            </button>
            <button 
              onClick={() => handleSort("date")} 
              className="block w-full text-left text-sm p-2 hover:bg-[var(--hover)] rounded"
            >
              Date
            </button>
          </div>
        )}
      </div>
  
      {/* Add Bookmark Button & Search Input on the Right */}
      <div className="flex flex-col items-end">
        

        <div className =" flex flex-row">
          <div ref={addKeywordRef} className="relative w-40 pr-2">
            <button
              onClick={() => setIsAddingKeyword(!isAddingKeyword)}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] p-2 rounded hover:brightness-120 w-full"
            >
              Add keyword
            </button>

            {isAddingKeyword && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-[var(--background)] border border-[var(--border)] shadow-md rounded-md p-4 z-50">
                
                {/* Keyword Input Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddKeyword();
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
                      <button 
                        key={index} 
                        className="bg-[var(--background)] text-[var(--primary-foreground)] text-sm px-2 py-1 rounded max-w-32 break-words text-center"
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



          {/* Add Bookmark Button */}
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
              </div>
            )}
          </div>
        </div>
  
        {/* Search Input (Now Directly Under the Button) */}
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded border-white bg-[var(--input-field)] text-black w-80 mt-2"
        />
      </div>
    </div>
  );
  
  
}


