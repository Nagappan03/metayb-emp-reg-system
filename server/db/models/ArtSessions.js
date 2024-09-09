const pool = require('../dbConnect');

const artSessionsTable = `
CREATE TABLE IF NOT EXISTS art_sessions (
  id SERIAL PRIMARY KEY,
  emp_id INTEGER NOT NULL,
  art_id INTEGER NOT NULL,
  time_spent INTERVAL,
  status VARCHAR(50),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (emp_id) REFERENCES employees(id),
  FOREIGN KEY (art_id) REFERENCES art_time_settings(id)
);
`;

async function createArtSessionsTable() {
  const client = await pool.connect();
  try {
    await client.query(artSessionsTable);
    console.log("Art Sessions table created successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
}

module.exports = { createArtSessionsTable };