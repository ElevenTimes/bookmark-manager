import React from 'react'

type BookmarkProps = {
  link: string;
  keywords?: string[];
  description?: string;
  folderID: number;
};

const Bookmark = ({ link, keywords, description, folderID }: BookmarkProps) => {
  return (
    <button
      type="button"
      className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      <a href={link} target="_blank" rel="noopener noreferrer">
        {description || "Open Bookmark"}
      </a>
    </button>
  );
};

export default Bookmark