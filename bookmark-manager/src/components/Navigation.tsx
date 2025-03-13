"use client"; // if you plan to add interactivity later (like clicking on folders)

import React from "react";

export default function Navigation() {
  // Example static folders for now (you can later make this dynamic)
  const folders = ["Work", "Personal", "Learning", "Favorites"];

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold mb-4">Folders</h2>
      <ul className="space-y-1">
        {folders.map((folder, index) => (
          <li key={index}>
            <button className="w-full text-left p-2 bg-[var(--primary)] text-[var(--secondary-foreground)] rounded hover:bg-[var(--border)]">
                {folder}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
