"use client";

import Bookmark from "./Bookmark";

type BookmarkListProps = {
  bookmarks: { id: string; link: string; description: string }[];
  onDeleteBookmark: (id: string) => void;
};

export default function BookmarkList({ bookmarks, onDeleteBookmark }: BookmarkListProps) {
  return (
    <div className="p-4 overflow-auto flex-1">
      <h2 className="text-xl font-bold mb-4">Bookmarks</h2>
      {bookmarks.length === 0 && <p>No bookmarks yet.</p>}
      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <Bookmark key={bookmark.id} {...bookmark} onDelete={onDeleteBookmark} />
        ))}
      </div>
    </div>
  );
}





