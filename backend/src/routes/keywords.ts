import express from 'express';
import pool from '../db';

const router = express.Router();

router.post('/', async (req, res) => {
  const { id, keyword } = req.body;

  if (!id || !keyword) {
    return res.status(400).json({ error: 'Missing id or keyword' });
  }

  try {
    await pool.execute(
      'INSERT INTO keyword (id, name) VALUES (?, ?)',
      [id, keyword]
    );
    res.status(201).json({ id, keyword });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(200).json({ id, keyword });
    } else {
      console.error('❌ Error adding keyword:', error);
      res.status(500).json({ error: 'Error adding keyword' });
    }
  }
});

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name FROM keyword');
    const keywords = (rows as any[]).map(row => ({
      id: row.id,
      keyword: row.name,
    }));
    res.status(200).json(keywords);
  } catch (error) {
    console.error('❌ Error fetching keywords:', error);
    res.status(500).json({ error: 'Error fetching keywords' });
  }
});

export default router;


