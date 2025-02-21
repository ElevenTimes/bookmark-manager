"use client";

import { useState } from "react";
import Bookmark from "./Bookmark";
import { v4 as uuidv4 } from "uuid"; // Generate unique IDs

const BookmarkList = () => {
  const [bookmarks, setBookmarks] = useState<{ id: string; link: string; description: string }[]>([]);
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  function handleAddBookmark(e: React.FormEvent) {
    e.preventDefault(); // Prevent page reload

    if (!link.trim()) return;

    const newBookmark = {
      id: uuidv4(),
      link,
      description: description || "No description",
    };

    setBookmarks([...bookmarks, newBookmark]);
    setLink(""); // Clear input fields
    setDescription("");
  }

  function handleDeleteBookmark(id: string) {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Bookmark</h2>

      {/* Form for Bookmark Input */}
      <form onSubmit={handleAddBookmark} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter link..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border p-2 rounded text-black"
        />
        <input
          type="text"
          placeholder="Enter description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded text-black"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Bookmark
        </button>
      </form>

      {/* Display Bookmarks */}
      <h2 className="text-xl font-bold mb-2">Bookmarks</h2>
      <div className="flex flex-col gap-2">
        {bookmarks.map((bookmark) => (
          <Bookmark key={bookmark.id} {...bookmark} onDelete={handleDeleteBookmark} />
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;




