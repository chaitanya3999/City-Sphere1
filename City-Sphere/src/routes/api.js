const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./city_sphere.db');

// Get all doctors
router.get('/doctors', (req, res) => {
    const query = req.query.search || '';
    const specialty = req.query.specialty || '';
    let sql = 'SELECT * FROM doctors WHERE 1=1';
    const params = [];

    if (query) {
        sql += ' AND (name LIKE ? OR specialization LIKE ?)';
        params.push(`%${query}%`, `%${query}%`);
    }

    if (specialty) {
        sql += ' AND specialization = ?';
        params.push(specialty);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Book appointment
router.post('/appointments', (req, res) => {
    const { doctorId, patientId, date, time } = req.body;
    
    if (!doctorId || !patientId || !date || !time) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    const sql = `INSERT INTO appointments (doctor_id, patient_id, appointment_date, appointment_time, status)
                 VALUES (?, ?, ?, ?, 'pending')`;
    
    db.run(sql, [doctorId, patientId, date, time], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Appointment booked successfully',
            appointmentId: this.lastID
        });
    });
});

// Get doctor's available time slots
router.get('/doctors/:id/timeslots', (req, res) => {
    const doctorId = req.params.id;
    const date = req.query.date;

    if (!date) {
        res.status(400).json({ error: 'Date is required' });
        return;
    }

    const sql = `
        SELECT time_slot FROM available_slots 
        WHERE doctor_id = ? AND date = ? 
        AND time_slot NOT IN (
            SELECT appointment_time FROM appointments 
            WHERE doctor_id = ? AND appointment_date = ?
        )`;

    db.all(sql, [doctorId, date, doctorId, date], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

module.exports = router;
