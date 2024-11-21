const express = require("express");
const router = express.Router();
const Account = require("../accountModel");
const Transaction = require("../transactionModel");
const Keypair = require("../Keypair");

// Create a new account
router.post("/create-account", async (req, res) => {
  const { keypair, initialBalance } = req.body;

  if (!keypair || !keypair.publicKey || !keypair.privateKey) {
    return res.status(400).json({ error: "Keypair with publicKey and privateKey is required." });
  }

  if (!initialBalance || initialBalance <= 0) {
    return res.status(400).json({ error: "Initial balance must be positive." });
  }

  try {
    const { publicKey, privateKey } = keypair;

    // Check if an account with the same public key already exists
    const existingAccount = await Account.findOne({ publicKey });
    if (existingAccount) {
      return res.status(400).json({ error: "Account with this public key already exists." });
    }

    // Encrypt the private key using the global password
    const account = new Account();
    const encryptedPrivateKey = account.encryptPrivateKey(privateKey);

    // Create and save the new account
    const newAccount = new Account({
      publicKey,
      encryptedPrivateKey,
      balance: initialBalance,
    });

    // Record the initial funding as a transaction
    const initialTransaction = new Transaction({
      type: "credit", // Initial credit to the account
      sender: "system", // Can be "system" or a predefined entity for the initial credit
      receiver: publicKey,
      amount: initialBalance,
      signature: Keypair.sign(`${publicKey}-${initialBalance}`, privateKey), // Use sender's private key for signing
    });

    // Save the transaction
    await initialTransaction.save();

    // Link the transaction to the account
    newAccount.transactions.push(initialTransaction._id);

    // Save the account with the transaction
    await newAccount.save();

    res.status(201).json({
      message: "Account created successfully.",
      publicKey: newAccount.publicKey,
      balance: newAccount.balance,
      transaction: initialTransaction,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View account balance
router.get("/view-balance/:publicKey", async (req, res) => {
  const { publicKey } = req.params;

  try {
    const account = await Account.findOne({ publicKey });

    if (!account) {
      return res.status(404).json({ error: "Account not found." });
    }

    res.json({ publicKey: account.publicKey, balance: account.balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transfer funds between accounts
router.post("/transfer", async (req, res) => {
  const { senderPublicKey, receiverPublicKey, amount } = req.body;

  try {
    // Validate request data
    if (!senderPublicKey || !receiverPublicKey) {
      return res.status(400).json({ error: "Both sender and receiver public keys are required." });
    }
    if (amount <= 0) {
      return res.status(400).json({ error: "Transfer amount must be positive." });
    }

    // Find sender and receiver accounts
    const sender = await Account.findOne({ publicKey: senderPublicKey });
    const receiver = await Account.findOne({ publicKey: receiverPublicKey });

    if (!sender) return res.status(404).json({ error: "Sender account not found." });
    if (!receiver) return res.status(404).json({ error: "Receiver account not found." });

    // Check for sufficient funds
    if (sender.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds." });
    }

    // Deduct amount from sender and add to receiver
    sender.balance -= amount;
    receiver.balance += amount;

    // Create the data string to sign (excluding transaction type)
    const transactionData = `${senderPublicKey}-${amount}-${receiverPublicKey}`;

    // Sign the data using the sender's private key (only the relevant data)
    const signature = Keypair.sign(transactionData, sender.decryptPrivateKey());

    // Create transactions (same signature for both debit and credit)
    const senderTransaction = new Transaction({
      type: "debit", // This is just a label, not used for signature
      sender: sender.publicKey,
      receiver: receiver.publicKey,
      amount,
      signature: signature,
    });

    const receiverTransaction = new Transaction({
      type: "credit", // This is just a label, not used for signature
      sender: sender.publicKey,
      receiver: receiver.publicKey,
      amount,
      signature: signature,
    });

    // Save transactions to the database
    await senderTransaction.save();
    await receiverTransaction.save();

    // Link transactions to sender and receiver
    sender.transactions.push(senderTransaction._id);
    receiver.transactions.push(receiverTransaction._id);

    // Save sender and receiver accounts
    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Transfer successful." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





module.exports = router;
