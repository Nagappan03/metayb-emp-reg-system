const pool = require('../dbConnect');

const pendingEmployeeTable = `
CREATE TABLE IF NOT EXISTS pending_employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

const updateModifiedColumnFunction = `
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
`;

const dropTriggerIfExists = `
DROP TRIGGER IF EXISTS update_pending_employees_modtime ON pending_employees;
`;

const pendingEmployeesModtimeTrigger = `
CREATE TRIGGER update_pending_employees_modtime
BEFORE UPDATE ON pending_employees
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();
`;

async function createPendingEmployeeTable() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(pendingEmployeeTable);
    await client.query(updateModifiedColumnFunction);
    await client.query(dropTriggerIfExists);
    await client.query(pendingEmployeesModtimeTrigger);
    await client.query('COMMIT');
    console.log("Employee table & update triggers created successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
}

module.exports = { createPendingEmployeeTable };