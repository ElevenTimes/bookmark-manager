import express from 'express';
import pool from '../db';  // Assuming 'pool' is your db connection object
import { v4 as uuidv4 } from 'uuid';  // Import uuidv4 to generate IDs

const router = express.Router();

// Function to get bookmarks from the database
const getBookmarks = async () => {
  try {
    const [rows] = await pool.execute('SELECT * FROM bookmark');
    return rows;
  } catch (error) {
    console.error('Error fetching bookmarks from DB:', error);
    throw error;
  }
};

// Function to add a bookmark to the database
const addBookmark = async (bookmark: any) => {
  const { id, link, description, date, keywords, folderIds } = bookmark;

  try {
    // Perform the insert query
    const [result] = await pool.execute(
      'INSERT INTO bookmark (id, link, description, date) VALUES (?, ?, ?, ?)', 
      [id, link, description, date]
    );

    // The result of an insert query is an array of ResultSetHeader type.
    const insertId = (result as any).insertId;

    // If you need to insert data into the bookmark_keyword or bookmark_folder tables, do that here.
    // Example:
    // await insertIntoBookmarkKeyword(insertId, keywords);
    // await insertIntoBookmarkFolder(insertId, folderIds);

    return { id, link, description, date, keywords, folderIds };
  } catch (error) {
    console.error('Error adding bookmark to DB:', error);
    throw error;
  }
};

router.get('/', async (req, res) => {
  try {
    const bookmarks = await getBookmarks();
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookmarks' });
  }
});

// New POST endpoint to add a bookmark
router.post('/', async (req, res) => {
  try {
    const newBookmark = req.body;
    const addedBookmark = await addBookmark(newBookmark);
    res.status(201).json(addedBookmark);  // Return the added bookmark with the id from the backend
  } catch (error) {
    res.status(500).json({ error: 'Error adding bookmark' });
  }
});

export default router;






