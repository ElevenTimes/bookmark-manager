import { useState } from 'react';
import BookmarkList from "@/components/BookmarkList"; // Client Component

export default function Home() {
  return (
    <div>
      <h1>Bookmark Manager</h1>
      <BookmarkList /> {/* Client Component for interactivity */}
    </div>
  );
}



