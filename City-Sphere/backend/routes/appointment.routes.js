const express = require('express');
const auth = require('../middleware/auth');
const { Appointment, Doctor } = require('../models/appointment.model');
const { Wallet, Transaction } = require('../models/wallet.model');
const router = express.Router();

// Get all doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json({ doctors });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
});

// Get doctor by ID
router.get('/doctors/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({ doctor });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctor', error: error.message });
    }
});

// Book appointment
router.post('/book', auth, async (req, res) => {
    try {
        const { doctorId, date, time, amount } = req.body;

        // Check if doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check wallet balance
        const wallet = await Wallet.findOne({ userId: req.user._id });
        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Process payment
        wallet.balance -= amount;
        await wallet.save();

        // Create transaction record
        const transaction = new Transaction({
            walletId: wallet._id,
            type: 'debit',
            amount,
            description: `Appointment booking with Dr. ${doctor.name}`
        });
        await transaction.save();

        // Create appointment
        const appointment = new Appointment({
            userId: req.user._id,
            doctorId,
            date,
            time,
            amount,
            transactionId: transaction._id,
            status: 'confirmed',
            paymentStatus: 'paid'
        });
        await appointment.save();

        res.status(201).json({ 
            appointment,
            transaction: {
                id: transaction._id,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                createdAt: transaction.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error booking appointment', error: error.message });
    }
});

// Get user appointments
router.get('/my-appointments', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user._id })
            .populate('doctorId')
            .sort({ date: -1 });
        res.json({ appointments });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
});

// Cancel appointment
router.post('/:id/cancel', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ 
            _id: req.params.id,
            userId: req.user._id
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.status === 'cancelled') {
            return res.status(400).json({ message: 'Appointment already cancelled' });
        }

        // Process refund
        const wallet = await Wallet.findOne({ userId: req.user._id });
        wallet.balance += appointment.amount;
        await wallet.save();

        // Create refund transaction
        const transaction = new Transaction({
            walletId: wallet._id,
            type: 'credit',
            amount: appointment.amount,
            description: 'Appointment cancellation refund'
        });
        await transaction.save();

        // Update appointment status
        appointment.status = 'cancelled';
        appointment.paymentStatus = 'refunded';
        await appointment.save();

        res.json({ 
            appointment,
            transaction: {
                id: transaction._id,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                createdAt: transaction.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
    }
});

module.exports = router;
