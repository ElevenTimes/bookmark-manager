import express from 'express';
import pool from '../db';  // Assuming 'pool' is your db connection object

const router = express.Router();

// Function to get bookmarks from the database
const getBookmarks = async () => {
  try {
    console.log('Fetched');
    const [rows] = await pool.execute('SELECT * FROM bookmark');
    return rows;
  } catch (error) {
    console.error('❌ Error fetching bookmarks from DB:', error);
    throw error;
  }
};

// Function to add a bookmark to the database
const addBookmark = async (bookmark: any) => {
  const { id, link, description, date, keywords, folderIds } = bookmark;

  const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

  console.log('📥 Received bookmark to add:', bookmark);

  try {
    console.log('📌 Inserting into bookmark table...');
    const [result] = await pool.execute(
      'INSERT INTO bookmark (id, link, description, date) VALUES (?, ?, ?, ?)', 
      [id, link, description, formattedDate]
    );

    const insertId = (result as any).insertId;
    console.log('✅ Insert successful. insertId:', insertId);

    // Log keyword and folder relationships
    console.log('🔑 Keywords:', keywords);
    console.log('📁 Folder IDs:', folderIds);

    // Example: Log where you would insert to junction tables
    // console.log('⏳ Inserting into bookmark_keyword and bookmark_folder...');

    return { id, link, description, formattedDate, keywords, folderIds };
  } catch (error) {
    console.error('❌ Error adding bookmark to DB:', error);
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
  console.log('📨 POST /api/bookmark called');
  console.log('📦 Request body:', req.body);

  try {
    const newBookmark = req.body;
    const addedBookmark = await addBookmark(newBookmark);
    console.log('✅ Bookmark added successfully:', addedBookmark);
    res.status(201).json(addedBookmark);
  } catch (error) {
    console.error('❌ Failed to add bookmark:', error);
    res.status(500).json({ error: 'Error adding bookmark' });
  }
});

export default router;







