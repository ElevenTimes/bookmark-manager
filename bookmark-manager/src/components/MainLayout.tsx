"use client";

import { useState, useRef } from "react";
import Registration from "./profile/Registration";
import Navigation from "./Navigation";
import BookmarkList from "./BookmarkList";
import ActionPanel from "./ActionPanel";
import { FolderType } from "./Folder";
import { KeywordType, createKeyword} from "./Keyword";
import { search } from "./functions/Search";
import { v4 as uuidv4 } from "uuid";

export default function MainLayout() {
  const [navWidth, setNavWidth] = useState(20); // in percentage, default 20%
  const isResizing = useRef(false);

  const [searchQuery, setSearchQuery] = useState("");
  
  const [bookmarks, setBookmarks] = useState<{ id: string; link: string; description: string; date: string; keywords: KeywordType[], folderIds: string[] }[]>([]);
  const [keywords, setKeywords] = useState<KeywordType[]>([]);

  const [folders, setFolders] = useState<FolderType[]>([{ id: "all", name: "All" }]);
  const [currentFolderId, setCurrentFolderId] = useState("all");

  const inputRef = useRef<HTMLInputElement>(null);

  // Mouse event handlers for resizing
  const handleMouseDown = () => (isResizing.current = true);
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth < 50) setNavWidth(newWidth);
    if (newWidth < 5) setNavWidth(0);
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
      folderIds: currentFolderId === "all" ? ["all"] : ["all", currentFolderId],
    };
    setBookmarks((prev) => [...prev, newBookmark]);
    console.log("New bookmark created:", newBookmark);
  };

  // Handle deleting bookmarks
  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // Function to handle folder creation
  const handleAddFolder = (folderName: string) => {
    const newFolder = { id: uuidv4(), name: folderName };
    setFolders((prev) => [...prev, newFolder]);
    setCurrentFolderId(newFolder.id); // Focus on the newly created folder
    console.log("New folder created:", newFolder);
  };

  const handleRenameFolder = (id: string, newName: string) => {
    setFolders(folders.map(folder =>
      folder.id === id ? { ...folder, name: newName } : folder
    ));
  };

  // Handle deleting a folder
  const handleDeleteFolder = (id: string) => {
    setFolders(folders.filter(folder => folder.id !== id));
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
  
  // Filter bookmarks based on current folder + search query
  const filteredBookmarks = search(
    bookmarks.filter((b) => b.folderIds.includes(currentFolderId)), // <-- Added filtering
    searchQuery
  );
  

  return (
    
    <div className={`flex h-screen ${isResizing ? 'select-none' : ''}`}>
      {/* Navigation Sidebar */}
      <div 
        className="bg-[var(--secondary-background)] text-[var(--foreground)] flex flex-col h-full relative z-0 overflow-hidden" 
        style={{ width: `${navWidth}%` }}
      >
        <Registration />
        <Navigation 
          folders={folders}
          onAddFolder={handleAddFolder} // Pass folder creation function
          onRenameFolder={handleRenameFolder} // Pass renaming function
          onDeleteFolder={handleDeleteFolder} // Pass deleting function
          chooseFolder={setCurrentFolderId} 
          inputRef={inputRef} // Pass ref for auto-focus
          currentFolderId={currentFolderId}
        />
      </div>


      {/* Divider */}
      <div onMouseDown={handleMouseDown} className="w-1 cursor-col-resize bg-[var(--border)] relative z-11" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
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

