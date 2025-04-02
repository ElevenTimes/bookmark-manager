"use client";

import React, { useState, useRef } from "react";
import { FolderPlus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Folder from "./Folder";

export default function Navigation({ chooseFolder }: { chooseFolder: (id: string) => void }) {
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([
    { id: "all", name: "All" }, // Default "All" folder
  ]);

  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChooseFolder = (id: string) => {
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
      setFolders([
        ...folders,
        { id: uuidv4(), name: newFolderName.trim() },
      ]);
    }
    setCreatingFolder(false); // Close input field
  }

  // Handle input blur (clicking outside)
  function handleBlur() {
    setCreatingFolder(false);
  }

  // Delete Folder
  function handleDeleteFolder(id: string) {
    setFolders(folders.filter(folder => folder.id !== id));
  }

  // Rename Folder
  function handleRenameFolder(id: string, newName: string) {
    setFolders(folders.map(folder =>
      folder.id === id ? { ...folder, name: newName } : folder
    ));
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

