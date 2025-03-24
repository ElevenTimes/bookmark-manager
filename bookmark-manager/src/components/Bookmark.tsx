"use client";

import { useState } from "react";

export type BookmarkType = {  // Renaming and exporting for reuse
  id: string;
  link: string;
  description: string;
  date: string;
};

type BookmarkProps = BookmarkType & {
  onDelete: (id: string) => void;
};

const Bookmark = ({ id, link, description, onDelete }: BookmarkProps) => {
  const [showMenu, setShowMenu] = useState(false);

  function handleRightClick(e: React.MouseEvent) {
    e.preventDefault();
    setShowMenu(!showMenu);
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
