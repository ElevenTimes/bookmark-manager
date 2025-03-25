"use client";

import { BookmarkType } from "../Bookmark"; // Adjust path if needed

export function search(bookmarks: BookmarkType[], query: string): BookmarkType[] {
  if (!query.trim()) return bookmarks; // Return all bookmarks if no search query

  return bookmarks.filter(
    (bookmark) =>
      bookmark.link.toLowerCase().includes(query.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(query.toLowerCase())
  );
}
