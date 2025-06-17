import express from "express";
import multer from "multer";
import fs from "fs";
import db from "../db";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/api/bookmark/import-sql",
  upload.single("file"),
  async (req: express.Request, res: express.Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No SQL file uploaded" });
      return;
    }

    const filePath = req.file.path;

    try {
      const sql = fs.readFileSync(filePath, "utf-8");
      await db.query(sql);
      fs.unlinkSync(filePath);

      res.status(200).json({ message: "Bookmarks imported successfully" });
    } catch (err) {
      console.error("❌ SQL import failed:", err);
      res.status(500).json({ error: "Failed to import bookmarks from SQL" });
    }
  }
);


export default router;
