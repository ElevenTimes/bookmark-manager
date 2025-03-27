"use client";

import { useState } from "react";
import { KeywordType } from "./Keyword";


export type BookmarkType = {
  id: string;
  link: string;
  description: string;
  date: string;
  keywords: KeywordType[];
};

type BookmarkProps = BookmarkType & {
  onDelete: (id: string) => void;
  onAddKeyword: (id: string, keyword: string) => void;
};

const Bookmark = ({ id, link, description, keywords, onDelete, onAddKeyword }: BookmarkProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  function handleRightClick(e: React.MouseEvent) {
    e.preventDefault();
    setShowMenu(!showMenu);
  }

  function handleAddKeyword() {
    if (!newKeyword.trim()) return;
    onAddKeyword(id, newKeyword.trim()); // Call parent function to update state
    setNewKeyword(""); // Clear input field
  }

  return (
    <div
      onContextMenu={handleRightClick}
      onDoubleClick={() => window.open(link, '_blank')}
      className="relative p-2 border-2 border-[var(--border)] rounded-md bg-[var(--background)] shadow-md cursor-pointer"
    >
      <div className="text-[var(--primary-foreground)]">
        {link}
      </div>
      <div className="text-[var(--secondary-foreground)]">
        {description || "Open Bookmark"}
      </div>

       {/* Displaying the keywords */}
       <div className="mt-2">
        {keywords.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {keywords.map((keyword) => (
              <span
                key={keyword.id}
                className="bg-[var(--primary)] text-[var(--primary-foreground)] text-sm px-2 py-1 rounded max-w-32 break-words text-center"
              >
                {keyword.keyword}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-500 text-xs">No keywords</span>
        )}
      </div>

      {showMenu && (
        <div className="absolute top-8 left-0 bg-[var(--background)] border border-[var(--border)] shadow-md rounded-md p-4 z-50">
          <button
            onClick={() => onDelete(id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Bookmark;
