"use client";

import Bookmark from "./Bookmark";
import { KeywordType } from "./Keyword"

type BookmarkListProps = {
  bookmarks: { id: string; link: string; description: string; date: string; keywords: KeywordType[]; folderIds: string[] }[];
  onDeleteBookmark: (id: string) => void;
  onAddKeyword: (id: string, keyword: string) => void; // <-- Add this line
  onRename: (id: string, newLink: string, newDescription: string) => void;
  allKeywords: KeywordType[];
  onToggleKeyword: (bookmarkId: string, keyword: KeywordType, add: boolean) => void;  
};

export default function BookmarkList({ bookmarks, onDeleteBookmark, onAddKeyword, onRename, allKeywords, onToggleKeyword }: BookmarkListProps) {
  return (
    <div className="p-4 overflow-auto flex-1">
      <h2 className="text-xl font-bold mb-4">Bookmarks</h2>
      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <Bookmark 
            key={bookmark.id} 
            {...bookmark} 
            onDelete={onDeleteBookmark} 
            onAddKeyword={onAddKeyword} // <-- Add this line
            onRename={onRename}
            allKeywords={allKeywords}
            onToggleKeyword={onToggleKeyword}
          />
        ))}
      </div>
    </div>
  );
}





