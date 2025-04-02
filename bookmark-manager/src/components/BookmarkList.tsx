"use client";

import Bookmark from "./Bookmark";
import { KeywordType } from "./Keyword"

type BookmarkListProps = {
  bookmarks: { id: string; link: string; description: string; date: string; keywords: KeywordType[]; folderIds: string[] }[];
  onDeleteBookmark: (id: string) => void;
  onAddKeyword: (id: string, keyword: string) => void; // <-- Add this line
};

export default function BookmarkList({ bookmarks, onDeleteBookmark, onAddKeyword }: BookmarkListProps) {
  return (
    <div className="p-4 overflow-auto flex-1">
      <h2 className="text-xl font-bold mb-4">Bookmarks</h2>
      {bookmarks.length === 0 && <p>No bookmarks yet.</p>}
      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <Bookmark 
            key={bookmark.id} 
            {...bookmark} 
            onDelete={onDeleteBookmark} 
            onAddKeyword={onAddKeyword} // <-- Add this line
          />
        ))}
      </div>
    </div>
  );
}





