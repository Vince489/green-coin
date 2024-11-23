class TransactionHistory {
  constructor() {
    this.transactions = [];  // Stores transactions as an array of Transaction IDs (MongoDB ObjectIds or transaction hashes)
  }

  // Add a transaction to the history
  addTransaction(transaction) {
    // Here, you can store transaction ID or transaction object (depending on your implementation)
    this.transactions.push(transaction);
  }

  // Get all transactions for the history
  getTransactions() {
    return this.transactions;
  }

  // Get the latest N transactions
  getLatestTransactions(limit = 10) {
    return this.transactions.slice(-limit);  // Return the latest N transactions
  }

  // Get transaction by ID
  getTransactionById(transactionId) {
    return this.transactions.find(t => t.id === transactionId);
  }
}

module.exports = TransactionHistory;
