import mysql from 'mysql2/promise';
import config from '../config.js';

async function queryDatabase(sql, params = []) {
  const connection = await mysql.createConnection(config.dbConfig);
  const [results] = await connection.execute(sql, params);
  await connection.end();
  return results;
}

export { queryDatabase };
