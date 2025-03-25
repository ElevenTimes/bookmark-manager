"use client";

import { BookmarkType } from "../Bookmark";

export function sort(bookmarks: BookmarkType[], criteria: "name" | "date", order: "asc" | "desc") {
  return [...bookmarks].sort((a, b) => {
    let comparison = 0;

    if (criteria === "name") {
      comparison = a.description.localeCompare(b.description);
    } else if (criteria === "date") {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    }

    return order === "asc" ? comparison : -comparison;
  });
}
