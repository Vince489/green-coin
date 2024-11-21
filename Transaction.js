class Transaction {
  constructor(type, amount, sender, receiver = null) {
    this.type = type;  // 'credit' or 'debit'
    this.amount = amount;
    this.timestamp = new Date().toISOString();
    this.sender = sender;  // Public key of the sender
    this.receiver = receiver;  // Public key of the receiver (only needed for transfers)
  }
}

module.exports = Transaction;