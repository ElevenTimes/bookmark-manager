// backend/db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'db',               // matches Docker service name
  user: 'root',
  password: 'example',
  database: 'bookmarks',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
