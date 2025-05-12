"use client";

import { useState, useRef } from "react";
import { KeywordType } from "./Keyword";
import useClickOutside from "./hooks/ClickOutside";

import { SquarePlus } from 'lucide-react';

export type BookmarkType = {
  id: string;
  link: string;
  description: string;
  date: string;
  keywords: KeywordType[];
  folderIds: string[];
};

type BookmarkProps = BookmarkType & {
  onDelete: (id: string) => void;
  onAddKeyword: (id: string, keyword: string) => void;
  onRename: (id: string, newLink: string, newDescription: string) => void;
  allKeywords: KeywordType[];
  onToggleKeyword: (bookmarkId: string, keyword: KeywordType, add: boolean) => void;
};

const Bookmark = ({ id, link, description, keywords, folderIds, onDelete, onAddKeyword, onRename, allKeywords, onToggleKeyword }: BookmarkProps) => {


  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const [isEditing, setIsEditing] = useState(false);
  const [editLink, setEditLink] = useState(link);
  const [editDescription, setEditDescription] = useState(description);

  const [isEditingKeywords, setIsEditingKeywords] = useState(false);


  const ref = useRef(null);
  const editRef = useRef(null);
  const keywordMenuRef = useRef(null);


  useClickOutside(ref, () => setShowMenu(false));
  useClickOutside(keywordMenuRef, () => setIsEditingKeywords(false));
  useClickOutside(editRef, () => setIsEditing(false));

  function handleRightClick(e: React.MouseEvent) {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  }

  function closeMenu() {
    setShowMenu(false);
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("bookmarkId", id);
      }}
      onContextMenu={handleRightClick}
      onDoubleClick={(e) => {
        if (!isEditing && !isEditingKeywords) {
          window.open(link, "_blank");
        }
      }}
      className="relative p-2 border-2 border-[var(--border)] rounded-md bg-[var(--background)] shadow-md cursor-pointer"
    >
    {isEditing ? (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onRename(id, editLink, editDescription);
          setIsEditing(false);
        }}
        className="flex flex-col gap-1"
        ref={editRef}
      >
        <input
          type="text"
          value={editLink}
          onChange={(e) => setEditLink(e.target.value)}
          className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded"
          placeholder="Edit link"
        />
        <input
          type="text"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded"
          placeholder="Edit description"
        />
        <div className="flex gap-2 mt-1">
          <button
            type="submit"
            className="text-[var(--primary-foreground)] hover:text-gray-500 text-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setEditLink(link);
              setEditDescription(description);
              setIsEditing(false);
            }}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>

      ) : (
        <>
          <div className="text-[var(--primary-foreground)]">{link}</div>
          <div className="text-[var(--secondary-foreground)]">
            {description || "Open Bookmark"}
          </div>
        </>
      )
    }


    {/* Keywords */}
    <div className="mt-2">
      <div className="flex flex-wrap gap-1">
        {keywords.map((keyword) => (
          <span
            key={keyword.id}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] text-sm px-2 py-1 rounded max-w-32 break-words text-center"
          >
            {keyword.keyword}
          </span>
        ))}
        <button
          onClick={() => setIsEditingKeywords((prev) => !prev)}
          title="Edit Keywords"
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <SquarePlus />
        </button>
      </div>
    </div>

    {isEditingKeywords && (
      <div 
        ref={keywordMenuRef}
        className="absolute z-50 mt-2 ml-4 bg-[var(--background)] border-2 border-t-0 border-[var(--border)] shadow-md p-4 rounded-b-lg max-w-md">
        <div className="flex flex-wrap gap-2">
          {allKeywords.map((keyword) => (
            <button
              key={keyword.id}
              onClick={() => {
                const isActive = keywords.some((k) => k.id === keyword.id);
                onToggleKeyword(id, keyword, !isActive); // Custom handler
              }}
              className={`text-sm px-2 py-1 rounded max-w-32 break-words text-center ${
                keywords.some((k) => k.id === keyword.id)
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--background)] text-[var(--primary-foreground)]"
              }`}
              style={{ outline: `2px solid var(--primary)` }}
            >
              {keyword.keyword}
            </button>
          ))}
        </div>

        <div className="flex justify-end mt-2">
          <button
            onClick={() => setIsEditingKeywords(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    )}



      {/* Context Menu */}
      {showMenu && (
        <div
          ref={ref}
          style={{ position: "fixed", top: menuPosition.y, left: menuPosition.x }}
          className="bg-[var(--background)] border border-[var(--border)] shadow-md rounded-md p-2 z-50"
          onClick={closeMenu}
        > 
          <button
            onClick={() => {
              setIsEditing(true);
              closeMenu();
            }}
            className="text-[var(--primary-foreground)] hover:text-gray-500 block"
          >
            Rename
          </button>

          <button
            onClick={() => {
              onDelete(id);
              closeMenu();
            }}
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

