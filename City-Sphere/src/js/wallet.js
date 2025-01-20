// DOM Elements
const addMoneyModal = document.getElementById('addMoneyModal');
const addMoneyForm = document.getElementById('addMoneyForm');
const closeModal = document.querySelector('.close');
const balanceElement = document.getElementById('balance');
const transactionsList = document.getElementById('transactionsList');

// Sample transaction data (replace with actual data from backend)
let transactions = [
    {
        id: 1,
        type: 'credit',
        amount: 500,
        description: 'Added money via UPI',
        date: '2024-01-17 15:30'
    },
    {
        id: 2,
        type: 'debit',
        amount: 200,
        description: 'Paid for groceries',
        date: '2024-01-17 14:45'
    }
];

// Initialize wallet
function initializeWallet() {
    updateTransactionsList();
    setupEventListeners();
}

// Update transactions list
function updateTransactionsList() {
    transactionsList.innerHTML = '';
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
function handleAddMoney(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    // Add new transaction
    const newTransaction = {
        id: transactions.length + 1,
        type: 'credit',
        amount: amount,
        description: `Added money via ${paymentMethod.toUpperCase()}`,
        date: new Date().toISOString()
    };
    
    // Update transactions list
    transactions.unshift(newTransaction);
    
    // Update balance
    const currentBalance = parseFloat(balanceElement.textContent.replace(',', ''));
    balanceElement.textContent = (currentBalance + amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Update UI
    updateTransactionsList();
    
    // Close modal and reset form
    addMoneyModal.style.display = 'none';
    addMoneyForm.reset();
    
    // Show success notification
    showNotification('Money added successfully!');
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
