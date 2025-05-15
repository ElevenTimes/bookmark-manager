import express from 'express';
import pool from '../db';

const router = express.Router();

// Add new keyword
router.post('/', async (req, res) => {
  const { id, keyword } = req.body;

  try {
    await pool.execute(
      'INSERT INTO keyword (id, name) VALUES (?, ?)',
      [id, keyword]
    );
    console.log('✅ Keyword inserted:', { id, keyword });


    res.status(201).json({ id, keyword });
  } catch (error: any) {
    // Ignore duplicate errors if using manual keyword addition
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(200).json({ id, keyword }); // Already exists
    } else {
      console.error('❌ Error adding keyword:', error);
      res.status(500).json({ error: 'Error adding keyword' });
    }
  }
});

// Optionally: Get all keywords (useful for auto-suggestions)
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name FROM keyword');
    const keywords = (rows as any[]).map(row => ({
      id: row.id,
      keyword: row.name,
    }));
    console.log('📤 Returning keywords:', keywords);
    res.json(keywords);
  } catch (error) {
    console.error('❌ Error fetching keywords:', error);
    res.status(500).json({ error: 'Error fetching keywords' });
  }
});

export default router;


