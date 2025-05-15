// routes/folder.ts
import express from 'express';
import pool from '../db';

const router = express.Router();

// Add new folder
router.post('/', async (req, res) => {
  const { id, name } = req.body;

  try {
    await pool.execute(
      'INSERT INTO folder (id, name) VALUES (?, ?)',
      [id, name]
    );
    console.log('✅ Folder inserted:', { id, name });
    res.status(201).json({ id, name });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(200).json({ id, name });
    } else {
      console.error('❌ Error adding folder:', error);
      res.status(500).json({ error: 'Error adding folder' });
    }
  }
});

// Get all folders
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name FROM folder');
    const folders = (rows as any[]).map(row => ({
      id: row.id,
      name: row.name,
    }));
    console.log('📤 Returning folders:', folders);
    res.json(folders);
  } catch (error) {
    console.error('❌ Error fetching folders:', error);
    res.status(500).json({ error: 'Error fetching folders' });
  }
});

export default router;
