const express = require('express');
const router = express.Router();
const pool = require('../db/dbConnect');

router.post('/saveArtTimeSettings', async (req, res) => {
  const { art_name, time_value, time_unit, admin_id } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const insertQuery = `
      INSERT INTO art_time_settings (art_name, time_value, time_unit, admin_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (art_name) DO UPDATE SET
      time_value = EXCLUDED.time_value,
      time_unit = EXCLUDED.time_unit,
      admin_id = EXCLUDED.admin_id;
    `;
    await client.query(insertQuery, [art_name, time_value, time_unit, admin_id]);
    await client.query('COMMIT');
    res.json({ message: "Time settings saved successfully." });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: "Failed to save time settings: " + error.message });
  } finally {
    client.release();
  }
});

router.get('/artMetrics', async (req, res) => {
  const { fromDate, toDate } = req.query;
  try {
    const query = `
      SELECT e.first_name, e.last_name, a.art_id, COUNT(*) as count
      FROM art_sessions a
      JOIN employees e ON a.emp_id = e.id
      WHERE a.start_time BETWEEN $1 AND $2
      AND a.status IN ('COMPLETED', 'IN PROGRESS')
      GROUP BY e.first_name, e.last_name, a.art_id
      ORDER BY count DESC, e.first_name, e.last_name;
    `;
    const result = await pool.query(query, [fromDate, toDate + ' 23:59:59']);
    const formattedResult = result.rows.map(row => ({
      emp_name: `${row.first_name} ${row.last_name}`,
      art_id: `ART ${row.art_id}`,
      count: row.count
    }));
    res.json(formattedResult);
  } catch (error) {
    console.error('Error fetching ART metrics:', error);
    res.status(500).json({ message: "Failed to fetch ART metrics." });
  }
});

router.get('/productivity', async (req, res) => {
  const { emp_id, date } = req.query;

  try {
    const query = `
      SELECT art_id, time_spent, status
      FROM art_sessions
      WHERE emp_id = $1 AND DATE(start_time) = $2 AND status IN ('COMPLETED', 'IN PROGRESS')
    `;
    const result = await pool.query(query, [emp_id, date]);
    const formattedResult = result.rows.map(row => ({
      art_id: `ART ${row.art_id}`,
      art_name: row.art_name,
      time_spent: row.time_spent,
      status: row.status
    }));

    res.json(formattedResult);
  } catch (error) {
    console.error('Error fetching ART productivity:', error);
    res.status(500).json({ message: "Failed to fetch ART productivity." });
  }
});

router.get('/employees', async (req, res) => {
  try {
    const query = 'SELECT id, first_name, last_name FROM employees ORDER BY first_name, last_name;';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: "Failed to fetch employees." });
  }
});

module.exports = router;