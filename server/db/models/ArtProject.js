const pool = require('../dbConnect');

const artProjectTable = `
CREATE TABLE IF NOT EXISTS art_projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  duration INTEGER NOT NULL  -- Duration in minutes
);
`;

async function createArtProjectTable() {
  const client = await pool.connect();
  try {
    await client.query(artProjectTable);
    console.log("Art Project table created successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
}

module.exports = { createArtProjectTable };