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

router.delete('/:id', async (req, res) => {
  const folderId = req.params.id;
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Remove from bookmark_folder join table first
    await connection.execute('DELETE FROM bookmark_folder WHERE folderId = ?', [folderId]);

    // Then delete the folder itself
    const [result] = await connection.execute('DELETE FROM folder WHERE id = ?', [folderId]);

    await connection.commit();

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: 'Folder not found' });
      return;
    }

    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting folder:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    connection.release();
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

// Rename (update) folder
router.put('/:id', async (req, res) => {
  const folderId = req.params.id;
  const { name } = req.body;

  try {
    const [result] = await pool.execute(
      'UPDATE folder SET name = ? WHERE id = ?',
      [name, folderId]
    );

    const affectedRows = (result as any).affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({ error: 'Folder not found' });
      return;
    }

    res.status(200).json({ message: 'Folder renamed successfully' });
  } catch (error) {
    console.error('Error renaming folder:', error);
    res.status(500).json({ error: 'Failed to rename folder' });
  }
});


export default router;
