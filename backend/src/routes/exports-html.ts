import express from "express";
import db from "../db";
import { RowDataPacket } from "mysql2";

const router = express.Router();

router.get("/api/bookmark/export-html", async (_req, res) => {
  try {
    const [folders] = await db.query<RowDataPacket[]>(`
      SELECT f.id as folderId, f.name as folderName
      FROM folder f
      WHERE f.name != 'All'
      ORDER BY f.name
    `);

    const [bookmarks] = await db.query<RowDataPacket[]>(`
      SELECT b.id, b.link, b.date, bf.folderId
      FROM bookmark b
      LEFT JOIN bookmark_folder bf ON b.id = bf.bookmarkId
      ORDER BY b.date DESC
    `);

    // Group bookmarks by folderId
    const folderMap = new Map<string, { name: string; bookmarks: RowDataPacket[] }>();

    folders.forEach((folder) => {
      folderMap.set(folder.folderId, { name: folder.folderName, bookmarks: [] });
    });

    bookmarks.forEach((bm) => {
      if (bm.folderId && folderMap.has(bm.folderId)) {
        folderMap.get(bm.folderId)!.bookmarks.push(bm);
      }
    });

    const htmlHeader = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file. -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>\n`;

    const htmlFooter = `</DL><p>`;

    const folderHtml = Array.from(folderMap.entries())
      .map(([_, { name, bookmarks }]) => {
        const folderAddDate = Math.floor(Date.now() / 1000);

        const links = bookmarks.map((bm) => {
          const url = bm.link;
          const title = bm.link; // 👈 Use link URL as display title
          const addDate = bm.date
            ? Math.floor(new Date(bm.date).getTime() / 1000)
            : folderAddDate;

          return `    <DT><A HREF="${url}" ADD_DATE="${addDate}">${title}</A>\n`;
        }).join("");

        return `  <DT><H3 ADD_DATE="${folderAddDate}">${name}</H3>\n  <DL><p>\n${links}  </DL><p>\n`;
      })
      .join("\n");

    const fullHtml = htmlHeader + folderHtml + htmlFooter;

    res.setHeader("Content-Disposition", "attachment; filename=bookmarks_export.html");
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.send(fullHtml);
  } catch (err) {
    console.error("❌ Failed to export bookmarks:", err);
    res.status(500).send("Internal server error");
  }
});

export default router;




