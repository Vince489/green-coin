const express = require("express");
const router = express.Router();
const AccountService = require("../AccountService");


// Create a new account
router.post("/create-account", async (req, res) => {
  const { publicKey, privateKey, initialBalance } = req.body;

  if (!publicKey || !privateKey || !initialBalance || initialBalance <= 0) {
    return res.status(400).json({ error: "Public key, private key, and initial balance are required." });
  }

  try {
    // Check if account with the publicKey already exists
    const existingAccount = await Account.findOne({ publicKey });
    if (existingAccount) {
      return res.status(400).json({ error: "Account with this public key already exists." });
    }

    // Encrypt the private key before storing it
    const encryptedPrivateKey = await Account.encryptPrivateKey(privateKey);

    // Create the new account
    const newAccount = new Account({
      publicKey,
      encryptedPrivateKey,
      balance: initialBalance,
      transactions: [],
    });

    // Save the new account to the database
    await newAccount.save();

    // Create the initial funding transaction (credit)
    const initialTransaction = new Transaction({
      sender: "system", // System as the sender for initial funding
      receiver: publicKey,
      amount: initialBalance,
      type: "credit",
      signature: "", // The system doesn't need a signature here
    });

    await initialTransaction.save();

    // Link the initial transaction to the account
    newAccount.transactions.push(initialTransaction._id);
    await newAccount.save();

    res.status(201).json({
      message: "Account created successfully.",
      publicKey: newAccount.publicKey,
      balance: newAccount.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// View account balance
// View account balance
router.get("/view-balance/:publicKey", async (req, res) => {
  const { publicKey } = req.params;

  try {
    // Find account by public key
    const account = await AccountModel.findOne({ publicKey });

    if (!account) {
      return res.status(404).json({ error: "Account not found." });
    }

    res.json({
      publicKey: account.publicKey,
      balance: account.balance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Transfer funds between accounts
// Transfer funds between accounts
router.post("/transfer", async (req, res) => {
  const { senderPublicKey, receiverPublicKey, amount, password } = req.body;

  try {
    // Use the AccountService to perform the transfer
    const { sender, receiver } = await AccountService.transferFunds(senderPublicKey, receiverPublicKey, amount, password);

    res.status(200).json({
      message: "Transfer successful.",
      senderPublicKey: sender.publicKey,
      receiverPublicKey: receiver.publicKey,
      senderBalance: sender.balance,
      receiverBalance: receiver.balance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
