const express = require('express');
const router = express.Router();
const pool = require('../db/dbConnect');

router.get('/registrationRequests', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const client = await pool.connect();
  try {
    const countResult = await client.query('SELECT COUNT(*) AS total FROM pending_employees WHERE status = \'pending\'');
    const totalItems = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(totalItems / limit);

    const query = 'SELECT * FROM pending_employees WHERE status = \'pending\' ORDER BY id LIMIT $1 OFFSET $2';
    const values = [limit, offset];
    const result = await client.query(query, values);

    res.json({
      requests: result.rows,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (error) {
    console.error('Error fetching registration requests:', error);
    res.status(500).json({ message: "Failed to fetch registration requests." });
  } finally {
    client.release();
  }
});

router.post('/approve/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const selectQuery = 'SELECT * FROM pending_employees WHERE id = $1';
    const selectResult = await client.query(selectQuery, [id]);

    if (selectResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Request not found." });
    }

    const employee = selectResult.rows[0];

    const insertQuery = 'INSERT INTO employees (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)';
    await client.query(insertQuery, [employee.first_name, employee.last_name, employee.email, employee.password]);

    const updateQuery = 'UPDATE pending_employees SET status = \'approved\' WHERE id = $1';
    await client.query(updateQuery, [id]);

    await client.query('COMMIT');
    res.json({ message: "Registration approved successfully." });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: "Failed to approve registration.", error: error.message });
  } finally {
    client.release();
  }
});

router.post('/reject/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE pending_employees SET status = \'rejected\' WHERE id = $1', [id]);
    await client.query('COMMIT');
    res.json({ message: "Registration rejected successfully." });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: "Failed to reject registration." });
  } finally {
    client.release();
  }
});

module.exports = router;