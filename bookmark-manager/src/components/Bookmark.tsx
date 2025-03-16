"use client";

import { useState } from "react";

type BookmarkProps = {
  id: string;
  link: string;
  description: string;
  onDelete: (id: string) => void;
};

const Bookmark = ({ id, link, description, onDelete }: BookmarkProps) => {
  const [showMenu, setShowMenu] = useState(false);

  function handleRightClick(e: React.MouseEvent) {
    e.preventDefault(); // Prevent default right-click behavior
    setShowMenu(!showMenu);
  }

  return (
    <div
      onContextMenu={handleRightClick} // Right-click to open context menu
      onDoubleClick={() => window.open(link, '_blank')} // Double-click to open link
      className="relative p-2 border-2 border-[var(--border)] rounded-md bg-[var(--background)] shadow-md cursor-pointer"
    >
      <div className="text-[var(--primary-foreground)]">
        {link}
      </div>
      <div className="text-[var(--secondary-foreground)]">
        {description || "Open Bookmark"}
      </div>
  
      {/* Context Menu */}
      {showMenu && (
        <div className="z-40 absolute top-8 left-0 bg-gray-200 shadow-md rounded-md p-2">
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
