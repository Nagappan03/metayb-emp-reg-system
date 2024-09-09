const pool = require('../dbConnect');

const employeeProjectTable = `
CREATE TABLE IF NOT EXISTS employee_projects (
  employee_id INTEGER REFERENCES employees(id),
  project_id INTEGER REFERENCES art_projects(id),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  PRIMARY KEY (employee_id, project_id)
);
`;

async function createEmployeeProjectTable() {
  const client = await pool.connect();
  try {
    await client.query(employeeProjectTable);
    console.log("Employee Project table created successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
}

module.exports = { createEmployeeProjectTable };