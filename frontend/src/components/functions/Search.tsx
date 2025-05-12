"use client";

import { BookmarkType } from "../Bookmark";

export function search(
  bookmarks: BookmarkType[],
  query: string,
  selectedKeywords: string[] = []
): BookmarkType[] {
  return bookmarks.filter((bookmark) => {
    const matchesQuery =
      !query.trim() ||
      bookmark.link.toLowerCase().includes(query.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(query.toLowerCase());

    const matchesKeywords =
      selectedKeywords.length === 0 ||
      selectedKeywords.every((kw) =>
        bookmark.keywords.some((bkKw) => bkKw.keyword === kw)
      );

    return matchesQuery && matchesKeywords;
  });
}

