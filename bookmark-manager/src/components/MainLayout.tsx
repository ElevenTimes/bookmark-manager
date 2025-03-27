"use client";

import { useState, useRef } from "react";
import Navigation from "./Navigation";
import BookmarkList from "./BookmarkList";
import ActionPanel from "./ActionPanel";
import { KeywordType, createKeyword} from "./Keyword";
import { search } from "./functions/Search";
import { v4 as uuidv4 } from "uuid";

export default function MainLayout() {
  const [navWidth, setNavWidth] = useState(20); // in percentage, default 20%
  const isResizing = useRef(false);
  const [bookmarks, setBookmarks] = useState<{ id: string; link: string; description: string; date: string; keywords: KeywordType[] }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [keywords, setKeywords] = useState<KeywordType[]>([]);

  // Mouse event handlers for resizing
  const handleMouseDown = () => (isResizing.current = true);
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 10 && newWidth < 50) setNavWidth(newWidth);
  };
  const handleMouseUp = () => (isResizing.current = false);

  // Attach global event listeners for mouse move and up
  if (typeof window !== "undefined") {
    window.onmousemove = handleMouseMove;
    window.onmouseup = handleMouseUp;
  }

  // Handle adding bookmarks
  const handleAddBookmark = (link: string, description: string, keywords: KeywordType[]) => {
    const newBookmark = {
      id: uuidv4(),
      link,
      description: description || "No description",
      date: new Date().toISOString(),
      keywords: keywords, // ✅ Store the selected keywords here
    };
    setBookmarks((prev) => [...prev, newBookmark]);
  };

  // Handle deleting bookmarks
  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAddKeyword = (bookmarkId: string, keywordText: string) => {
    setBookmarks((prev) =>
      prev.map((bookmark) =>
        bookmark.id === bookmarkId
          ? {
              ...bookmark,
              keywords: bookmark.keywords.some((kw) => kw.keyword === keywordText)
                ? bookmark.keywords.filter((kw) => kw.keyword !== keywordText) // Toggle off
                : [...bookmark.keywords, createKeyword(keywordText)], // Toggle on
            }
          : bookmark
      )
    );
  
    // Optional: Ensure global keyword list is updated
    if (!keywords.some((kw) => kw.keyword === keywordText)) {
      setKeywords((prev) => [...prev, createKeyword(keywordText)]);
    }
  };

  const filteredBookmarks = search(bookmarks, searchQuery);

  return (
    
    <div className={`flex h-screen ${isResizing ? 'select-none' : ''}`}>
      {/* Navigation Sidebar */}
      <div className="bg-[var(--secondary-background)] text-[var(--foreground)] p-4" style={{ width: `${navWidth}%` }}>
        <Navigation />
      </div>

      {/* Divider */}
      <div onMouseDown={handleMouseDown} className="w-1 cursor-col-resize bg-[var(--primary)]" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="pb-10">
        <ActionPanel 
          onAddBookmark={handleAddBookmark} 
          bookmarks={bookmarks} 
          setBookmarks={setBookmarks}
          setSearchQuery={setSearchQuery}
          keywords={keywords} // Pass keywords list here
          setKeywords={setKeywords} // Pass setKeywords function here
        />

        </div>
        <BookmarkList 
          bookmarks={filteredBookmarks} 
          onDeleteBookmark={handleDeleteBookmark} 
          onAddKeyword={handleAddKeyword} // <-- Ensure this is passed
        />
      </div>
    </div>
  );
}

