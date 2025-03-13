"use client";

import { useState, useRef } from "react";
import Navigation from "./Navigation";
import BookmarkList from "./BookmarkList";
import ActionPanel from "./ActionPanel";

export default function MainLayout() {
  const [navWidth, setNavWidth] = useState(20); // in percentage, default 20%
  const isResizing = useRef(false);

  // Mouse event handlers
  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 10 && newWidth < 50) { // Optional min/max limits
      setNavWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  // Attach global event listeners for mouse move and up
  if (typeof window !== "undefined") {
    window.onmousemove = handleMouseMove;
    window.onmouseup = handleMouseUp;
  }

  return (
    <div className="flex h-screen">
      {/* Navigation */}
      <div
        className="bg-[var(--secondary-background)] text-[var(--foreground)] p-4"
        style={{ width: `${navWidth}%` }}
      >
        <Navigation />
      </div>

      {/* Divider */}
      <div
        onMouseDown={handleMouseDown}
        className="w-1 cursor-col-resize bg-[var(--border)]"
      />

      {/* Right side (ActionPanel + BookmarkList) */}
      <div className="flex-1 flex flex-col">
        {/* Action Panel */}
        <div className="h-[10%] min-h-[60px] p-4 bg-[var(--background)] border-b-2 border-[var(--border)]">
          <ActionPanel />
        </div>

        {/* Bookmark List */}
        <div className="flex-1 p-4 overflow-auto">
          <BookmarkList />
        </div>
      </div>
    </div>
  );
}

