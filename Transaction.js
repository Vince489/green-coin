const Keypair = require('./Keypair');

class Transaction {
  constructor(type, amount, sender, receiver = null, signature = null) {
    this.type = type;  // 'credit' or 'debit'
    this.amount = amount;
    this.timestamp = new Date().toISOString();
    this.sender = sender;  // Public key of the sender
    this.receiver = receiver;  // Public key of the receiver (only needed for transfers)
    this.signature = signature;  // Signature of the transaction (optional)
  }

  // Method to sign the transaction using the sender's private key
  sign(privateKey) {
    this.signature = Keypair.sign(this.toString(), privateKey);
  }

  // Convert the transaction to a string (for signing)
  toString() {
    return `${this.type}:${this.amount}:${this.sender}:${this.receiver}:${this.timestamp}`;
  }
}

module.exports = Transaction;