import express from "express";
import db from "../db";
import { RowDataPacket } from "mysql2";

const router = express.Router();

router.get("/export-sql", async (_req, res) => {
  try {
    const [bookmarks] = await db.query<RowDataPacket[]>(`
      SELECT id, link, description, date FROM bookmark
    `);

    const [folders] = await db.query<RowDataPacket[]>(`
      SELECT id, name FROM folder
    `);

    const [keywords] = await db.query<RowDataPacket[]>(`
      SELECT id, name FROM keyword
    `);

    const [bookmarkFolders] = await db.query<RowDataPacket[]>(`
      SELECT bookmarkId, folderId FROM bookmark_folder
    `);

    const [bookmarkKeywords] = await db.query<RowDataPacket[]>(`
      SELECT bookmarkId, keywordId FROM bookmark_keyword
    `);

    let sqlExport = `-- Bookmark Full Export
-- Date: ${new Date().toISOString()}
-- Bookmarks: ${bookmarks.length}, Folders: ${folders.length}, Keywords: ${keywords.length}
\n`;

    // Export bookmarks
    bookmarks.forEach(({ id, link, description, date }) => {
      const safeLink = link.replace(/'/g, "\\'");
      const safeDescription = description?.replace(/'/g, "\\'") || '';
      const formattedDate = new Date(date).toISOString().slice(0, 19).replace("T", " ");
      sqlExport += `INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('${id}', '${safeLink}', '${safeDescription}', '${formattedDate}', NULL) ON DUPLICATE KEY UPDATE link='${safeLink}', description='${safeDescription}', date='${formattedDate}';\n`;
    });

    // Export folders
    sqlExport += `\n-- Folders\n`;
    folders.forEach(({ id, name }) => {
      const safeName = name.replace(/'/g, "\\'");
      sqlExport += `INSERT INTO folder (id, name, bookmarkListId) VALUES ('${id}', '${safeName}', NULL) ON DUPLICATE KEY UPDATE name='${safeName}';\n`;
    });

    // Export keywords
    sqlExport += `\n-- Keywords\n`;
    keywords.forEach(({ id, name }) => {
      const safeName = name.replace(/'/g, "\\'");
      sqlExport += `INSERT INTO keyword (id, name) VALUES ('${id}', '${safeName}') ON DUPLICATE KEY UPDATE name='${safeName}';\n`;
    });

    // Export bookmark-folder relations
    sqlExport += `\n-- Bookmark-Folder Links\n`;
    bookmarkFolders.forEach(({ bookmarkId, folderId }) => {
      sqlExport += `INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('${bookmarkId}', '${folderId}') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;\n`;
    });

    // Export bookmark-keyword relations
    sqlExport += `\n-- Bookmark-Keyword Links\n`;
    bookmarkKeywords.forEach(({ bookmarkId, keywordId }) => {
      sqlExport += `INSERT INTO bookmark_keyword (bookmarkId, keywordId) VALUES ('${bookmarkId}', '${keywordId}') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;\n`;
    });

    res.setHeader("Content-Disposition", "attachment; filename=bookmarks_export.sql");
    res.setHeader("Content-Type", "application/sql");
    res.send(sqlExport);
  } catch (err) {
    console.error("❌ Failed to export SQL:", err);
    res.status(500).send("Failed to export bookmarks as SQL");
  }
});

export default router;

