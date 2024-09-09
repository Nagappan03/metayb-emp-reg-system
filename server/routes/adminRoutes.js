const express = require('express');
const router = express.Router();
const pool = require('../db/dbConnect');
const bcrypt = require('bcrypt')

router.get('/validateCode', async (req, res) => {
    const { code } = req.query;
    try {
        const result = await pool.query('SELECT * FROM admin_access_codes WHERE access_code = $1 AND status = \'Unused\'', [code]);
        if (result.rows.length > 0) {
            res.status(200).json({ isValid: true });
        } else {
            res.status(200).json({ isValid: false, message: "Code is invalid or already used." });
        }
    } catch (error) {
        console.error('Error validating access code:', error);
        res.status(500).json({ message: "Error validating access code." });
    }
});

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, accessCode } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const codeCheck = await client.query(
            'SELECT * FROM admin_access_codes WHERE access_code = $1 AND status = $2',
            [accessCode, 'Unused']
        );
        if (codeCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Invalid or already used access code." });
        }

        const emailCheck = await client.query('SELECT * FROM admins WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: "Email already registered." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const insertAdmin = 'INSERT INTO admins (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id';
        const values = [firstName, lastName, email, hashedPassword];
        const adminResult = await client.query(insertAdmin, values);

        await client.query(
            'UPDATE admin_access_codes SET status = $1 WHERE access_code = $2',
            ['Used', accessCode]
        );

        await client.query('COMMIT');
        res.status(201).json({ message: "Admin registered successfully.", adminId: adminResult.rows[0].id });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Failed to register admin:', error);
        res.status(500).json({ message: "Failed to register admin." });
    } finally {
        client.release();
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            const admin = result.rows[0];
            const isMatch = await bcrypt.compare(password, admin.password);
            if (isMatch) {
                res.json({ message: "Login successful", adminId: admin.id });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            res.status(404).json({ message: "Admin not found" });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;