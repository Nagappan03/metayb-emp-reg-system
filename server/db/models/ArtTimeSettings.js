const pool = require('../dbConnect');

const artTimeSettingsTable = `
CREATE TABLE IF NOT EXISTS art_time_settings (
  id SERIAL PRIMARY KEY,
  art_name VARCHAR(255) NOT NULL UNIQUE,
  time_value INTEGER NOT NULL,
  time_unit VARCHAR(50) NOT NULL,
  admin_id INTEGER,
  FOREIGN KEY (admin_id) REFERENCES admins(id)
);
`;

async function createArtTimeSettingsTable() {
  const client = await pool.connect();
  try {
    await client.query(artTimeSettingsTable);
    console.log("ART Time settings table created successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
}

module.exports = { createArtTimeSettingsTable };