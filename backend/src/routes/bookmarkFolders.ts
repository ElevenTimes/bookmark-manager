// routes/bookmarkFolder.ts
import { Router } from 'express';
import db from '../db';

const router = Router();

// Add folder to bookmark
router.post('/', async (req, res) => {
  const { bookmarkId, folderId } = req.body;

  try {
    await db.query(
      'INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES (?, ?)',
      [bookmarkId, folderId]
    );
    res.status(200).json({ message: 'Folder added to bookmark' });
  } catch (error) {
    console.error('Error adding folder to bookmark:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Remove folder from bookmark
router.delete('/', async (req, res) => {
  const { bookmarkId, folderId } = req.body;

  try {
    await db.query(
      'DELETE FROM bookmark_folder WHERE bookmarkId = ? AND folderId = ?',
      [bookmarkId, folderId]
    );
    res.status(200).json({ message: 'Folder removed from bookmark' });
  } catch (error) {
    console.error('Error removing folder from bookmark:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/', async (req, res) => {
  const { bookmarkId, oldFolderId, newFolderId } = req.body;
  console.log('Updating bookmark folder:', { bookmarkId, oldFolderId, newFolderId });

  try {
    await db.query(
      'DELETE FROM bookmark_folder WHERE bookmarkId = ? AND folderId = ?',
      [bookmarkId, oldFolderId]
    );
    await db.query(
      'INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES (?, ?)',
      [bookmarkId, newFolderId]
    );

    res.status(200).json({ message: 'Bookmark folder updated' });
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ error: 'Database error' });
  }
});



export default router;
