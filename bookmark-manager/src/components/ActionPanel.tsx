"use client";

import React, { useState } from "react";

type ActionPanelProps = {
  onAddBookmark: (link: string, description: string) => void;
};

export default function ActionPanel({ onAddBookmark }: ActionPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;
    onAddBookmark(link, description);
    setLink("");
    setDescription("");
    setIsAdding(false);
  };

  return (
    <div className="p-4 border-b-2 border-[var(--border)]">
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[var(--secondary)] text-[var(--primary-foreground)] p-2 rounded hover:brightness-120"
        >
          Add Bookmark
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
          <input
            type="text"
            placeholder="Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="border p-2 rounded border-white bg-[var(--input-field)] text-black"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded border-white bg-[var(--input-field)] text-black"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[var(--secondary)] text-[var(--secondary-foreground)] p-2 rounded hover:brightness-120 flex-1"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="bg-red-500 text-white p-2 rounded hover:brightness-120"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

