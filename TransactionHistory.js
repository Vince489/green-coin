class TransactionHistory {
  constructor() {
    this.transactions = [];
  }

  // Add a transaction to history
  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  // View the entire transaction history
  viewHistory() {
    return this.transactions;
  }
}

module.exports = TransactionHistory;