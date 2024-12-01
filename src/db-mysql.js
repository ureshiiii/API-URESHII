const mysql = require('mysql2/promise');
const config = require('../config');

async function queryDatabase(sql, params = []) {
  const connection = await mysql.createConnection(config.dbConfig);
  const [results] = await connection.execute(sql, params);
  await connection.end();
  return results;
}

module.exports = { queryDatabase };