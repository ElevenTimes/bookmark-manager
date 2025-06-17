"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Registration from "./profile/Registration";
import { VIEWS, ViewType } from "./Views";
import ImportExport from "./ImportExport";
import Navigation from "./Navigation";
import BookmarkList from "./BookmarkList";
import ActionPanel from "./ActionPanel";
import { FolderType } from "./Folder";
import { KeywordType, createKeyword} from "./Keyword";
import { search } from "./functions/Search";
import { v4 as uuidv4 } from "uuid";

export default function MainLayout() {

  const [view, setView] = useState<ViewType>(VIEWS.BOOKMARKS);

  const [navWidth, setNavWidth] = useState(20);
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

  // At the top level of MainLayout component
  const fetchData = useCallback(async () => {
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
  }, []);


  // useEffect stays the same
  useEffect(() => {
    fetchData();
  }, []);



  // Handle adding bookmarks
  const handleAddBookmark = async (link: string, description: string, keywords: KeywordType[]) => {
    const newBookmark = {
      id: uuidv4(),
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
  const handleDeleteBookmark = async (id: string) => {
    try {
      const res = await fetch(`/api/bookmark/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        console.log('Bookmark deleted successfully');
      } else {
        console.error('Failed to delete bookmark:', await res.text());
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const handleRenameBookmark = async (id: string, newLink: string, newDescription: string) => {
    try {
      const res = await fetch(`/api/bookmark/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          link: newLink,
          description: newDescription,
        }),
      });

      if (res.ok) {
        setBookmarks((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, link: newLink, description: newDescription } : b
          )
        );
        console.log('Bookmark renamed successfully');
      } else {
        console.error('Failed to rename bookmark:', await res.text());
      }
    } catch (error) {
      console.error('Error renaming bookmark:', error);
    }
  };



  const moveBookmarkToFolder = async (bookmarkId: string, targetFolderId: string) => {
    // Find the bookmark to get its current folderIds (excluding 'all')
    const bookmark = bookmarks.find(b => b.id === bookmarkId);
    if (!bookmark) return;

    // Determine old folders to remove except 'all'
    const oldFolderIds = bookmark.folderIds.filter(id => id !== 'all');

    // Optimistically update UI to have just 'all' and new target folder
    setBookmarks(prev =>
      prev.map(b =>
        b.id === bookmarkId
          ? { ...b, folderIds: ['all', targetFolderId] }
          : b
      )
    );

    try {
      // For each old folder (except 'all'), remove link
      for (const oldFolderId of oldFolderIds) {
        await fetch('/api/bookmark/folder', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookmarkId, folderId: oldFolderId }),
        });
      }

      // Add new folder link
      await fetch('/api/bookmark/folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookmarkId, folderId: targetFolderId }),
      });

      console.log('✅ Bookmark folder updated in DB');
    } catch (err) {
      console.error('❌ Error updating folder in DB:', err);
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


  const handleRenameFolder = async (id: string, newName: string) => {
    try {
      const res = await fetch(`/api/folder/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (res.ok) {
        setFolders(folders.map(folder =>
          folder.id === id ? { ...folder, name: newName } : folder
        ));
        console.log('Folder renamed successfully');
      } else {
        console.error('Failed to rename folder:', await res.text());
      }
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
  };


  // Handle deleting a folder
  const handleDeleteFolder = async (id: string) => {
    try {
      const res = await fetch(`/api/folder/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        console.error('Failed to delete folder:', await res.text());
        return;
      }

      setFolders((prev) => prev.filter((folder) => folder.id !== id));
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
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
    searchSelectedKeywords.map(k => k.keyword)
  );

  return (
    
    <div className={`flex h-screen ${isResizing ? 'select-none' : ''}`}>
      {/* Navigation Sidebar */}
      <div 
        className="bg-[var(--secondary-background)] text-[var(--foreground)] flex flex-col h-full relative z-0 overflow-hidden" 
        style={{ width: `${navWidth}%` }}
      >
        <Registration setView={setView} currentView={view} />

        <Navigation 
          folders={folders}
          onAddFolder={handleAddFolder} 
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
          chooseFolder={setCurrentFolderId} 
          inputRef={inputRef}
          currentFolderId={currentFolderId}
          moveBookmarkToFolder={moveBookmarkToFolder}
        />
      </div>


      {/* Divider */}
      <div onMouseDown={handleMouseDown} className="w-1 cursor-col-resize bg-[var(--border)] relative z-11" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {view === VIEWS.BOOKMARKS && (
          <>
            <div className="pb-10">
              <ActionPanel 
                onAddBookmark={handleAddBookmark} 
                bookmarks={bookmarks} 
                setBookmarks={setBookmarks}
                setSearchQuery={setSearchQuery}
                keywords={keywords}
                searchSelectedKeywords={searchSelectedKeywords}
                setSearchSelectedKeywords={setSearchSelectedKeywords}
                handleCreateKeyword={handleCreateKeyword}
              />
            </div>
            <BookmarkList 
              bookmarks={filteredBookmarks} 
              onDeleteBookmark={handleDeleteBookmark} 
              onRename={handleRenameBookmark}
              allKeywords={keywords}
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
          </>
        )}

        {view === VIEWS.IMPORT_EXPORT && (
          <div className="p-8">
            <ImportExport onImportComplete={fetchData} />
          </div>
        )}
      </div>

    </div>
  );
}

