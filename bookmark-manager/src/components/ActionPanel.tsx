"use client";

import React, { useState, useEffect, useRef } from "react";
import { BookmarkType } from "./Bookmark"; // Adjust path if needed
import { sort } from "./functions/Sort";

type ActionPanelProps = {
  onAddBookmark: (link: string, description: string) => void;
  bookmarks: BookmarkType[];
  setBookmarks: React.Dispatch<React.SetStateAction<BookmarkType[]>>;
};

export default function ActionPanel({ onAddBookmark, bookmarks, setBookmarks }: ActionPanelProps) {
  const [isSorting, setIsSorting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  // Refs for detecting clicks outside
  const sortRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLDivElement>(null);

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

  // Detect clicks outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortRef.current && !sortRef.current.contains(event.target as Node) &&
        addRef.current && !addRef.current.contains(event.target as Node)
      ) {
        setIsSorting(false);
        setIsAdding(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-32 p-4 border-b-2 border-[var(--border)] flex items-start justify-between relative">
      {/* Sort Button with Dropdown */}
      <div ref={sortRef} className="relative inline-block">
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

      {/* Add Bookmark Button with Dropdown Form */}
      <div ref={addRef} className="relative inline-block">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[var(--secondary)] text-[var(--primary-foreground)] p-2 rounded hover:brightness-120"
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
  );
}


