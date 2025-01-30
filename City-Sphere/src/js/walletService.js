// Wallet Service to manage wallet balance across pages
class WalletService {
    constructor() {
        this.initializeWallet();
    }

    initializeWallet() {
        if (!localStorage.getItem('walletBalance')) {
            localStorage.setItem('walletBalance', '0');
        }
        if (!localStorage.getItem('transactions')) {
            localStorage.setItem('transactions', '[]');
        }
    }

    getBalance() {
        return parseFloat(localStorage.getItem('walletBalance') || '0');
    }

    async addMoney(amount) {
        const currentBalance = this.getBalance();
        const newBalance = currentBalance + amount;
        localStorage.setItem('walletBalance', newBalance.toString());
        
        // Add transaction
        await this.addTransaction('credit', amount, 'Added money to wallet');
        return newBalance;
    }

    async refundMoney(amount, description) {
        const currentBalance = this.getBalance();
        const newBalance = currentBalance + amount;
        localStorage.setItem('walletBalance', newBalance.toString());
        
        // Add transaction
        await this.addTransaction('credit', amount, description);
        return newBalance;
    }

    async deductMoney(amount, description) {
        const currentBalance = this.getBalance();
        if (currentBalance < amount) {
            throw new Error('Insufficient balance');
        }
        
        const newBalance = currentBalance - amount;
        localStorage.setItem('walletBalance', newBalance.toString());
        
        // Add transaction
        await this.addTransaction('debit', amount, description);
        return newBalance;
    }

    async addTransaction(type, amount, description) {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const newTransaction = {
            id: Date.now(),
            type,
            amount,
            description,
            date: new Date().toISOString()
        };
        
        transactions.push(newTransaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        return newTransaction;
    }

    getTransactions() {
        return JSON.parse(localStorage.getItem('transactions') || '[]');
    }
}

// Create a singleton instance
const walletService = new WalletService();
export default walletService;
