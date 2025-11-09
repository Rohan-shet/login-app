const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',       // your postgres username
  host: 'localhost',
  database: 'newdb',      // your DB name
  password: 'rohan4', // change to your password
  port: 5432              // default postgres port
});

module.exports = pool;
