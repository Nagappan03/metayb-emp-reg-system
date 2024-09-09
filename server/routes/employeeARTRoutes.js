const express = require('express');
const router = express.Router();
const pool = require('../db/dbConnect');

router.get('/fetchArtDetails', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, art_name, time_value, time_unit FROM art_time_settings ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching art details:', error);
    res.status(500).json({ message: "Failed to fetch art details." });
  }
});

router.post('/save/:id', async (req, res) => {
  const { timeSpent } = req.body;
  try {
    await pool.query(`UPDATE art_sessions SET time_spent = $1::interval, status = 'COMPLETED', end_time = NOW() WHERE id = $2`, [timeSpent, req.params.id]);
    res.json({ message: "Session saved successfully." });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ message: "Failed to save session." });
  }
});

router.post('/start', async (req, res) => {
  const { emp_id, art_id } = req.body;
  try {
    const insertResult = await pool.query('INSERT INTO art_sessions (emp_id, art_id, time_spent, status, start_time) VALUES ($1, $2, \'00:00:00\', \'CREATED\', NOW()) RETURNING id', [emp_id, art_id]);
    res.json({ message: "Session started successfully.", sessionId: insertResult.rows[0].id });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ message: "Failed to start session." });
  }
});

module.exports = router;