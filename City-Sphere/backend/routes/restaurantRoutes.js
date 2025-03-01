const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const User = require('../models/User');

// Place order endpoint
router.post('/order', auth, async (req, res) => {
    try {
        const { restaurantName, items, subtotal, taxRate, taxAmount, totalAmount, specialInstructions } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create the order
        const order = {
            restaurantName,
            items,
            subtotal,
            taxRate,
            taxAmount,
            totalAmount,
            specialInstructions,
            orderDate: new Date(),
            status: 'placed',
            paymentStatus: 'paid'
        };

        if (!user.orders) {
            user.orders = [];
        }
        user.orders.push(order);

        await user.save();

        res.json({ 
            success: true,
            message: 'Order placed successfully',
            order,
            newBalance: user.walletBalance
        });
    } catch (error) {
        console.error('Order error:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
});

// Get user's orders
router.get('/orders/my', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return actual orders array instead of wallet history
        res.json(user.orders || []);
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Add this route to handle order cancellation
router.post('/order/:orderId/cancel', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const order = user.orders.id(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const orderDate = new Date(order.orderDate);
        const timeDiff = Date.now() - orderDate.getTime();
        if (timeDiff > 60000) { // 60 seconds
            return res.status(400).json({ message: 'Cannot cancel order after 60 seconds' });
        }

        // Refund the amount
        user.walletBalance += order.totalAmount;
        user.walletHistory.push({
            type: 'credit',
            amount: order.totalAmount,
            description: `Refund for cancelled order at ${order.restaurantName}`,
            date: new Date()
        });

        // Remove the order
        order.remove();
        await user.save();

        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ message: 'Failed to cancel order' });
    }
});

module.exports = router; 