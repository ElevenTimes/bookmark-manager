"use client";

import { BookmarkType } from "../Bookmark";

export function sort(bookmarks: BookmarkType[], criteria: "link" | "description" | "date", order: "asc" | "desc") {
  return [...bookmarks].sort((a, b) => {
    let comparison = 0;

    if (criteria === "link") {
      comparison = a.link.localeCompare(b.link);
    }
    else if (criteria === "description") {
      comparison = a.description.localeCompare(b.description);
    } 
    else if (criteria === "date") {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    }

    return order === "asc" ? comparison : -comparison;
  });
}
