import { Router } from 'express';
import db from '../db'; // adjust the path to your database module

const router = Router();

// Add keyword to bookmark
router.post('/', async (req, res) => {
  const { bookmarkId, keywordId } = req.body;

  try {
    await db.query(
      'INSERT INTO bookmark_keyword (bookmarkId, keywordId) VALUES (?, ?)',
      [bookmarkId, keywordId]
    );
    res.status(200).json({ message: 'Keyword added to bookmark' });
  } catch (error) {
    console.error('Error adding keyword to bookmark:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Remove keyword from bookmark
router.delete('/', async (req, res) => {
  const { bookmarkId, keywordId } = req.body;

  try {
    await db.query(
      'DELETE FROM bookmark_keyword WHERE bookmarkId = ? AND keywordId = ?',
      [bookmarkId, keywordId]
    );
    res.status(200).json({ message: 'Keyword removed from bookmark' });
  } catch (error) {
    console.error('Error removing keyword from bookmark:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
