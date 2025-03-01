const express = require('express');
const auth = require('../middleware/auth.middleware');
const { Wallet, Transaction } = require('../models/wallet.model');
const router = express.Router();
const User = require('../models/User');

// Get wallet balance
router.get('/balance', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ balance: Number(user.walletBalance || 0) });
    } catch (error) {
        console.error('Get balance error:', error);
        res.status(500).json({ message: 'Failed to get balance' });
    }
});

// Deduct from wallet
router.post('/deduct', auth, async (req, res) => {
    try {
        const { amount, description } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.walletBalance < amount) {
            return res.status(400).json({ 
                message: `Insufficient balance. Need ₹${amount} but have ₹${user.walletBalance}` 
            });
        }

        user.walletBalance -= amount;
        user.walletHistory.push({
            type: 'debit',
            amount,
            description,
            date: new Date()
        });

        await user.save();

        res.json({ 
            success: true,
            newBalance: user.walletBalance,
            message: 'Payment successful'
        });
    } catch (error) {
        console.error('Deduct error:', error);
        res.status(500).json({ message: 'Failed to process payment' });
    }
});

// Add money to wallet
router.post('/add', auth, async (req, res) => {
    try {
        const { amount, description } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.walletBalance += amount;
        user.walletHistory.push({
            type: 'credit',
            amount,
            description,
            date: new Date()
        });

        await user.save();

        res.json({
            success: true,
            newBalance: user.walletBalance,
            message: 'Money added successfully'
        });
    } catch (error) {
        console.error('Add money error:', error);
        res.status(500).json({ message: 'Failed to add money' });
    }
});

// Process payment
router.post('/pay', auth, async (req, res) => {
    try {
        const { amount, description } = req.body;
        const wallet = await Wallet.findOne({ userId: req.user._id });

        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        wallet.balance -= amount;
        await wallet.save();

        // Create transaction record
        const transaction = new Transaction({
            walletId: wallet._id,
            type: 'debit',
            amount,
            description
        });
        await transaction.save();

        res.json({ 
            balance: wallet.balance,
            transaction: {
                id: transaction._id,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                createdAt: transaction.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing payment', error: error.message });
    }
});

// Process refund
router.post('/refund', auth, async (req, res) => {
    try {
        const { amount, description, transactionId } = req.body;
        let wallet = await Wallet.findOne({ userId: req.user._id });

        if (!wallet) {
            wallet = new Wallet({ userId: req.user._id });
        }

        wallet.balance += amount;
        await wallet.save();

        // Create refund transaction record
        const transaction = new Transaction({
            walletId: wallet._id,
            type: 'credit',
            amount,
            description: `Refund: ${description}`,
            refundedTransaction: transactionId
        });
        await transaction.save();

        res.json({ 
            balance: wallet.balance,
            transaction: {
                id: transaction._id,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                createdAt: transaction.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing refund', error: error.message });
    }
});

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user._id });
        if (!wallet) {
            return res.json({ transactions: [] });
        }

        const transactions = await Transaction.find({ walletId: wallet._id })
            .sort({ createdAt: -1 })
            .limit(parseInt(req.query.limit) || 10)
            .skip(parseInt(req.query.skip) || 0);

        res.json({ transactions });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
});

module.exports = router;
