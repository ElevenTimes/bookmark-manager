"use client";

import Bookmark from "./Bookmark";
import { KeywordType } from "./Keyword"

type BookmarkListProps = {
  bookmarks: { id: string; link: string; description: string; date: string; keywords: KeywordType[]; folderIds: string[] }[];
  onDeleteBookmark: (id: string) => void;
  onRename: (id: string, newLink: string, newDescription: string) => void;
  allKeywords: KeywordType[];
  onToggleKeyword: (bookmarkId: string, keyword: KeywordType, add: boolean) => void;  
};

export default function BookmarkList({ bookmarks, onDeleteBookmark, onRename, allKeywords, onToggleKeyword }: BookmarkListProps) {

  return (
    <div className="p-4 overflow-auto flex-1">
      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <Bookmark 
            key={bookmark.id} 
            {...bookmark} 
            onDelete={onDeleteBookmark} 
            onRename={onRename}
            allKeywords={allKeywords}
            onToggleKeyword={onToggleKeyword}
          />
        ))}
      </div>
    </div>
  );
}





