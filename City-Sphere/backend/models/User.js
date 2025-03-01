const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number
});

const orderSchema = new mongoose.Schema({
    restaurantName: String,
    items: [{
        name: String,
        price: Number,
        quantity: Number
    }],
    subtotal: Number,
    taxRate: Number,
    taxAmount: Number,
    totalAmount: Number,
    specialInstructions: String,
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['placed', 'preparing', 'ready', 'delivered'],
        default: 'placed'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    walletBalance: {
        type: Number,
        default: 0,
        min: 0
    },
    walletHistory: [{
        type: {
            type: String,
            enum: ['credit', 'debit'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        description: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    orders: [orderSchema]
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User; 