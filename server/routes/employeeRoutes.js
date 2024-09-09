const express = require('express');
const router = express.Router();
const pool = require('../db/dbConnect');
const bcrypt = require('bcrypt')

router.post('/registerPendingEmployee', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const emailCheck = await client.query('SELECT * FROM pending_employees WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: "Email already registered." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const insertPendingEmployee = 'INSERT INTO pending_employees (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id';
        const values = [firstName, lastName, email, hashedPassword];
        const pendingEmployeeResult = await client.query(insertPendingEmployee, values);

        await client.query('COMMIT');
        res.status(201).json({ message: "Employee registered successfully.", pendingEmployeeId: pendingEmployeeResult.rows[0].id });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Failed to register employee:', error);
        res.status(500).json({ message: "Failed to register employee." });
    } finally {
        client.release();
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM employees WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            const employee = result.rows[0];
            const isMatch = await bcrypt.compare(password, employee.password);
            if (isMatch) {
                res.json({ message: "Login successful", employeeId: employee.id });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            res.status(404).json({ message: "Employee not found" });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;