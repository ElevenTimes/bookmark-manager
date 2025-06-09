import express from 'express';
import pool from '../db';

const router = express.Router();

export const getBookmarks = async () => {
  try {
    console.log('Fetched');

    const [bookmarks]: [any[], any] = await pool.execute('SELECT * FROM bookmark');

    const [bookmarkKeywords]: [any[], any] = await pool.execute(`
      SELECT bk.bookmarkId, k.id AS keywordId, k.name
      FROM bookmark_keyword bk
      JOIN keyword k ON bk.keywordId = k.id
    `);

    const [bookmarkFolders]: [any[], any] = await pool.execute(`
      SELECT bookmarkId, folderId
      FROM bookmark_folder
    `);

    const bookmarkMap = bookmarks.map((b: any) => {
      const keywords = bookmarkKeywords
        .filter((kw: any) => kw.bookmarkId === b.id)
        .map((kw: any) => ({
          id: kw.keywordId,
          name: kw.name,
        }));

      const folderIds = bookmarkFolders
        .filter((f: any) => f.bookmarkId === b.id)
        .map((f: any) => f.folderId);

      return {
        id: b.id,
        link: b.link,
        description: b.description,
        date: b.date,
        keywords,
        folderIds,
      };
    });

    return bookmarkMap;
  } catch (error) {
    console.error('❌ Error fetching bookmarks from DB:', error);
    throw error;
  }
};


const addBookmark = async (bookmark: any) => {
  const { id, link, description, date, keywords, folderIds } = bookmark;
  const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

  console.log('📥 Received bookmark to add:', bookmark);

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    console.log('📌 Inserting into bookmark table...');
    await connection.execute(
      'INSERT INTO bookmark (id, link, description, date) VALUES (?, ?, ?, ?)', 
      [id, link, description, formattedDate]
    );

    // Insert folder relationships (including "all")
    for (const folderId of folderIds) {
      await connection.execute(
        'INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES (?, ?)',
        [id, folderId]
      );
    }

    // Insert keyword relationships (optional)
    for (const keyword of keywords) {
      await connection.execute(
        'INSERT INTO bookmark_keyword (bookmarkId, keywordId) VALUES (?, ?)',
        [id, keyword.id]
      );
    }

    await connection.commit();
    console.log('✅ All insertions successful.');

    return { id, link, description, formattedDate, keywords, folderIds };
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error adding bookmark to DB:', error);
    throw error;
  } finally {
    connection.release();
  }
};

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    // Delete from junction tables first
    await connection.execute('DELETE FROM bookmark_keyword WHERE bookmarkId = ?', [id]);
    await connection.execute('DELETE FROM bookmark_folder WHERE bookmarkId = ?', [id]);

    // Then delete from bookmark table
    await connection.execute('DELETE FROM bookmark WHERE id = ?', [id]);

    await connection.commit();
    res.status(200).json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  } finally {
    connection.release();
  }
});



router.get('/', async (req, res) => {
  try {
    const bookmarks = await getBookmarks();
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookmarks' });
  }
});

router.post('/', async (req, res) => {
  console.log('📨 POST /api/bookmark called');
  console.log('📦 Request body:', req.body);

  try {
    const newBookmark = req.body;
    const addedBookmark = await addBookmark(newBookmark);
    res.status(201).json(addedBookmark);
  } catch (error) {
    console.error('❌ Failed to add bookmark:', error);
    res.status(500).json({ error: 'Error adding bookmark' });
  }
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { link, description } = req.body;

  try {
    const [result] = await pool.execute(
      'UPDATE bookmark SET link = ?, description = ? WHERE id = ?',
      [link, description, id]
    );

    const affectedRows = (result as any).affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({ error: 'Bookmark not found' });
      return;
    }

    res.status(200).json({ message: 'Bookmark updated successfully' });
  } catch (error) {
    console.error('Error updating bookmark:', error);
    res.status(500).json({ error: 'Failed to update bookmark' });
  }
});


export default router;








