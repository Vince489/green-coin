const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // Sender's public key
  receiver: { type: String, required: true }, // Receiver's public key
  amount: { type: Number, required: true }, // Transaction amount
  type: { type: String, enum: ["credit", "debit"], required: true }, // Type of transaction
  signature: { type: String, required: true }, // Digital signature of the transaction
  timestamp: { type: Date, default: Date.now }, // When the transaction occurred
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
