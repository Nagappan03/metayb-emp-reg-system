const pool = require('../dbConnect');

const employeeTable = `
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
`;

async function createEmployeeTable() {
  const client = await pool.connect();
  try {
    await client.query(employeeTable);
    console.log("Employee table created successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
}

module.exports = { createEmployeeTable };