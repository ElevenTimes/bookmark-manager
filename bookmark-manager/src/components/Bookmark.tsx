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
      className="relative p-2 border rounded-md bg-white shadow-md"
      onContextMenu={handleRightClick} // Right-click opens menu
    >
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {description || "Open Bookmark"}
      </a>

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
