"use client";

import { useState, useRef, useEffect } from "react";
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

  const [searchSelectedKeywords, setSearchSelectedKeywords] = useState<KeywordType[]>([]);

  
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookmarkRes, keywordRes, folderRes] = await Promise.all([
          fetch('/api/bookmark'),
          fetch('/api/keyword'),
          fetch('/api/folder'),
        ]);

        const [bookmarkData, keywordData, folderData] = await Promise.all([
          bookmarkRes.json(),
          keywordRes.json(),
          folderRes.json(),
        ]);

        if (
          !Array.isArray(bookmarkData) ||
          !Array.isArray(keywordData) ||
          !Array.isArray(folderData)
        ) {
          console.error("Unexpected data format");
          setBookmarks([]);
          setKeywords([]);
          setFolders([]);
          return;
        }

        setBookmarks(bookmarkData);
        setKeywords(keywordData);
        setFolders(folderData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setBookmarks([]);
        setKeywords([]);
        setFolders([]);
      }
    };

    fetchData();
  }, []);


  // Handle adding bookmarks
  const handleAddBookmark = async (link: string, description: string, keywords: KeywordType[]) => {
    const newBookmark = {
      id: uuidv4(), // ✅ Re-add this
      link,
      description: description || "No description",
      date: new Date().toISOString(),
      keywords: keywords,
      folderIds: currentFolderId === "all" ? ["all"] : ["all", currentFolderId],
    };

    // Send the new bookmark to the backend API
    try {
      const response = await fetch('/api/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBookmark),
      });

      if (response.ok) {
        const addedBookmark = await response.json();
        console.log("New bookmark added:", addedBookmark);

        // Update local state with the newly added bookmark
        setBookmarks((prev) => [...prev, addedBookmark]);
      } else {
        console.error("Failed to add bookmark:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };



  // Handle deleting bookmarks
  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleRenameBookmark = (id: string, newLink: string, newDescription: string) => {
    setBookmarks((prev) => 
      prev.map((b) =>
        b.id === id ? { ...b, link: newLink, description: newDescription } : b)
    );
  };

const moveBookmarkToFolder = async (bookmarkId: string, targetFolderId: string) => {
  // Optimistically update UI
  setBookmarks((prev) =>
    prev.map((b) =>
      b.id === bookmarkId
        ? { ...b, folderIds: ['all', targetFolderId] }
        : b
    )
  );

  // Send update to backend
  try {
    const res = await fetch('/api/bookmark/folder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookmarkId,
        folderId: targetFolderId,
      }),
    });

    if (!res.ok) {
      console.error('❌ Failed to update folder in DB');
      // Optionally: roll back UI update here
    } else {
      console.log('✅ Bookmark folder updated in DB');
    }
  } catch (err) {
    console.error('❌ Error updating folder in DB:', err);
    // Optionally: roll back UI update here
  }
};

  

  // Function to handle folder creation
  const handleAddFolder = async (folderName: string) => {
    const newFolder = { id: uuidv4(), name: folderName };
    try {
      const res = await fetch('/api/folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFolder),
      });

      if (res.ok) {
        setFolders((prev) => [...prev, newFolder]);
        setCurrentFolderId(newFolder.id);
        console.log("✅ Folder saved:", newFolder);
      } else {
        console.error("❌ Failed to save folder");
      }
    } catch (err) {
      console.error("❌ Error saving folder:", err);
    }
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

  const handleCreateKeyword = async (keywordText: string) => {
    if (!keywordText.trim()) return;

    const existing = keywords.find((kw) => kw.keyword === keywordText);
    if (existing) return;

    const newKeyword = createKeyword(keywordText);

    try {
      const response = await fetch('/api/keyword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKeyword),
      });

      if (response.ok) {
        const addedKeyword = await response.json();
        setKeywords((prev) => [...prev, addedKeyword]);
        console.log("✅ Keyword created:", addedKeyword);
      } else {
        console.error("❌ Failed to create keyword:", response.statusText);
      }
    } catch (error) {
      console.error("❌ Error creating keyword:", error);
    }
  };



  
  // Filter bookmarks based on current folder + search query
  const filteredBookmarks = search(
    bookmarks.filter((b) => b.folderIds.includes(currentFolderId)),
    searchQuery,
    searchSelectedKeywords.map(k => k.keyword) // <--- Pass keyword names
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
          moveBookmarkToFolder={moveBookmarkToFolder}
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
            searchSelectedKeywords={searchSelectedKeywords}
            setSearchSelectedKeywords={setSearchSelectedKeywords}
            handleCreateKeyword={handleCreateKeyword}
          />
        </div>
        <BookmarkList 
          bookmarks={filteredBookmarks} 
          onDeleteBookmark={handleDeleteBookmark} 
          onRename={handleRenameBookmark} // <-- Ensure this is passed
          allKeywords={keywords} // Pass the global keywords list
          onToggleKeyword={async (bookmarkId, keyword, add) => {
            setBookmarks((prev) =>
              prev.map((b) =>
                b.id === bookmarkId
                  ? {
                      ...b,
                      keywords: add
                        ? [...b.keywords, keyword]
                        : b.keywords.filter((k) => k.id !== keyword.id),
                    }
                  : b
              )
            );

            try {
              const response = await fetch(`/api/bookmark/keyword`, {
                method: add ? 'POST' : 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  bookmarkId,
                  keywordId: keyword.id,
                }),
              });

              if (!response.ok) {
                console.error(`❌ Failed to ${add ? "add" : "remove"} keyword`, await response.text());
              } else {
                console.log(`✅ Keyword ${add ? "added to" : "removed from"} bookmark`);
              }
            } catch (error) {
              console.error("❌ API error while updating bookmark-keyword relation:", error);
            }
          }}

        />
      </div>
    </div>
  );
}

