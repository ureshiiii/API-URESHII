import mysql from 'mysql2/promise';
import config from './config.js';

// Membuat connection pool
const pool = mysql.createPool({
  host: config.dbConfig.host,
  user: config.dbConfig.user,
  password: config.dbConfig.password,
  database: config.dbConfig.database,
  port: config.dbConfig.port,
  waitForConnections: true,
  connectionLimit: 10, // Jumlah koneksi maks
  queueLimit: 0, // Gada batas antri
});

// Function buat query
async function queryDatabase(sql, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();

    const [results] = await connection.execute(sql, params);
    return results;
  } catch (err) {
    console.error('Database query error:', err.message);
    throw new Error('Query database gagal dijalankan.');
  } finally {
    if (connection) connection.release();
  }
}

export { queryDatabase };
