import walletService from './walletService.js';

// DOM Elements
const addMoneyModal = document.getElementById('addMoneyModal');
const addMoneyForm = document.getElementById('addMoneyForm');
const closeModal = document.querySelector('.close');
const balanceElement = document.getElementById('balance');
const transactionsList = document.getElementById('transactionsList');

// Initialize wallet
function initializeWallet() {
    updateWalletBalance();
    updateTransactionsList();
    setupEventListeners();
}

// Update wallet balance display
function updateWalletBalance() {
    const balance = walletService.getBalance();
    if (balanceElement) {
        balanceElement.textContent = balance.toFixed(2);
    }
}

// Update transactions list
function updateTransactionsList() {
    if (!transactionsList) return;
    
    transactionsList.innerHTML = '';
    const transactions = walletService.getTransactions();
    transactions.forEach(transaction => {
        const transactionElement = createTransactionElement(transaction);
        transactionsList.appendChild(transactionElement);
    });
}

// Create transaction element
function createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    
    const icon = transaction.type === 'credit' ? 'fa-arrow-down' : 'fa-arrow-up';
    const amountClass = transaction.type === 'credit' ? 'amount-credit' : 'amount-debit';
    const amountPrefix = transaction.type === 'credit' ? '+' : '-';
    
    div.innerHTML = `
        <div class="transaction-details">
            <div class="transaction-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="transaction-info">
                <h4>${transaction.description}</h4>
                <p>${formatDate(transaction.date)}</p>
            </div>
        </div>
        <div class="transaction-amount ${amountClass}">
            ${amountPrefix}₹${transaction.amount.toFixed(2)}
        </div>
    `;
    
    return div;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add Money button
    document.querySelector('.btn-add-money').addEventListener('click', () => {
        addMoneyModal.style.display = 'block';
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        addMoneyModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addMoneyModal) {
            addMoneyModal.style.display = 'none';
        }
    });

    // Add money form submission
    addMoneyForm.addEventListener('submit', handleAddMoney);
}

// Handle add money form submission
async function handleAddMoney(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    try {
        await walletService.addMoney(amount);
        updateWalletBalance();
        updateTransactionsList();
        addMoneyModal.style.display = 'none';
        addMoneyForm.reset();
        alert('Money added successfully!');
    } catch (error) {
        console.error('Error adding money:', error);
        alert('Failed to add money. Please try again.');
    }
}

// Quick action functions
function showSendMoneyModal() {
    // Implement send money functionality
    showNotification('Send money feature coming soon!');
}

function showRequestMoneyModal() {
    // Implement request money functionality
    showNotification('Request money feature coming soon!');
}

function showTransactionHistory() {
    // Implement full transaction history view
    showNotification('Full transaction history coming soon!');
}

function showSettings() {
    // Implement wallet settings
    showNotification('Wallet settings coming soon!');
}

// Initialize wallet when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeWallet);
