const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'art_project',
  password: 'admin',
  port: 5432,
});

module.exports = pool;