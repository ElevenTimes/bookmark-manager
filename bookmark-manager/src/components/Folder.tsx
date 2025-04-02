import { useState, useRef } from "react";

export type FolderType = {
  id: string;
  name: string;
};

type FolderProps = FolderType & {
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onSelect: (id: string) => void; // <-- Added
};

const Folder = ({ id, name, onDelete, onRename, onSelect }: FolderProps) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(name);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Activate rename mode on double-click
  function startRenaming() {
    setIsRenaming(true);
    setNewName(name);
    setTimeout(() => inputRef.current?.focus(), 10);
  }

  // Finish renaming when Enter is pressed or input loses focus
  function finishRenaming() {
    if (newName.trim() && newName !== name) {
      onRename(id, newName.trim());
    }
    setIsRenaming(false);
  }

  // Handle right-click to show menu
  function handleRightClick(e: React.MouseEvent) {
    e.preventDefault();
    setShowMenu(true);
  }

  // Hide menu if clicking outside
  function handleClickOutside() {
    setShowMenu(false);
  }

  return (
    <div className="relative" onClick={handleClickOutside}>
      {isRenaming ? (
        <input
          ref={inputRef}
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && finishRenaming()}
          onBlur={finishRenaming}
          className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded mb-2"
        />
      ) : (
        <button
          onContextMenu={handleRightClick}
          onDoubleClick={startRenaming}
          onClick={() => onSelect(id)} // <-- Call chooseFolder
          className="w-full text-left p-2 bg-[var(--primary)] text-[var(--secondary-foreground)] rounded hover:bg-[var(--border)] mb-2"
        >
          {name}
        </button>
      )}

      {/* Context menu */}
      {showMenu && id != "all" && (
        <div className="absolute top-8 right-0 bg-[var(--primary)] shadow-md rounded-md p-2 z-10">
          <button
            onClick={() => onDelete(id)}
            className="text-[var(--secondary-foreground)]"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Folder;

  
