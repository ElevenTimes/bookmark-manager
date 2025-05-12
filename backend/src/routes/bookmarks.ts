import express from 'express';
import pool from '../db';  // Assuming 'pool' is your db connection object

const router = express.Router();

// Function to get bookmarks from the database
const getBookmarks = async () => {
  try {
    const [rows] = await pool.execute('SELECT * FROM bookmarks');
    return rows;
  } catch (error) {
    console.error('Error fetching bookmarks from DB:', error);
    throw error;
  }
};

router.get('/', async (req, res) => {
  try {
    const bookmarks = await getBookmarks(); // Now it works
    res.json(bookmarks); // Send bookmarks as response
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookmarks' });
  }
});

export default router;

