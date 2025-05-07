"use client";

import React, { useState } from "react";
import { FolderPlus } from "lucide-react";
import Folder from "./Folder";

export default function Navigation({ folders, onAddFolder, onRenameFolder, onDeleteFolder, chooseFolder, inputRef, currentFolderId, moveBookmarkToFolder,}: { 
  folders: { id: string; name: string }[];
  onAddFolder: (folderName: string) => void;
  onRenameFolder: (id: string, newName: string) => void;
  onDeleteFolder: (id: string) => void;
  chooseFolder: (id: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  currentFolderId: string;
  moveBookmarkToFolder: (bookmarkId: string, targetFolderId: string) => void;
}) {
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const [selectedFolderId, setSelectedFolderId] = useState(currentFolderId);

  const handleChooseFolder = (id: string) => {
    setSelectedFolderId(id);
    chooseFolder(id);
  };

  // Handle adding a new folder
  function handleAddFolder() {
    setCreatingFolder(true);
    setNewFolderName("");
    setTimeout(() => inputRef.current?.focus(), 10); // Auto-focus input
  }

  // Save folder when Enter is pressed
  function handleSaveFolder() {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim());
    }
    setCreatingFolder(false); 
  }

  // Handle input blur (clicking outside)
  function handleBlur() {
    setCreatingFolder(false);
  }

  // Delete Folder
  function handleDeleteFolder(id: string) {
    onDeleteFolder(id);
  }

  // Rename Folder
  function handleRenameFolder(id: string, newName: string) {
    onRenameFolder(id, newName);
  }

  return (
    <div className="space-y-2 p-4">
      {/* Title & Add Folder Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Folders</h2>
        <button onClick={handleAddFolder} className="p-1">
          <FolderPlus size={24} className="text-[var(--foreground)]" />
        </button>
      </div>

      {/* Folder List */}
      <ul className="space-y-1">
        {folders.map((folder) => (
          <li key={folder.id}>
            <Folder
              id={folder.id}
              name={folder.name}
              onDelete={handleDeleteFolder}
              onRename={handleRenameFolder}
              onSelect={handleChooseFolder}
              isSelected={selectedFolderId === folder.id}
              moveBookmarkToFolder={moveBookmarkToFolder}
            />
          </li>
        ))}

        {/* Input Field for Creating Folder */}
        {creatingFolder && (
          <li>
            <input
              ref={inputRef}
              type="text"
              className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveFolder()}
              onBlur={handleBlur} // Disappear if clicking outside
            />
          </li>
        )}
      </ul>
    </div>
  );
}



