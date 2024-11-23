const KeypairService = require("./KeypairService");
const Keypair = require("./Keypair");
const Account = require("./Account");
const AccountModel = require("./accountModel");
const TransactionModel = require("./transactionModel");
const Transaction = require("./Transaction");


class AccountService {
  // Create account logic
  static async createAccount(publicKey, initialBalance) {
    // Validate balance
    if (initialBalance <= 0) {
      throw new Error("Initial balance must be positive.");
    }

    // Check if account already exists
    const existingAccount = await AccountModel.findOne({ publicKey });
    if (existingAccount) {
      throw new Error("Account already exists.");
    }

    // Create the keypair
    const keypair = KeypairService.generateKeypair();

    // Create account instance (handling account creation)
    const newAccount = new Account(publicKey, keypair.keypair.secretKey, initialBalance);

    // Create and sign the initial transaction (credit)
    const initialTransaction = new Transaction("credit", initialBalance, publicKey);
    const signedTransaction = KeypairService.sign(initialTransaction.toString(), keypair.keypair.secretKey);

    // Save data to database
    await AccountModel.create({ publicKey, balance: initialBalance, keypair: keypair.keypair });
    await TransactionModel.create(initialTransaction);

    return newAccount;
  }

  // Transfer funds logic
  static async transferFunds(senderPublicKey, receiverPublicKey, amount, password) {
    // Validate request
    if (amount <= 0) {
      throw new Error("Transfer amount must be positive.");
    }

    // Retrieve accounts
    const sender = await AccountModel.findOne({ publicKey: senderPublicKey });
    const receiver = await AccountModel.findOne({ publicKey: receiverPublicKey });

    // Check accounts and balance
    if (!sender || !receiver) {
      throw new Error("Sender or receiver not found.");
    }
    if (sender.balance < amount) {
      throw new Error("Insufficient funds.");
    }

    // Decrypt private key and create keypair
    const decryptedPrivateKey = await KeypairService.decryptPrivateKey(senderPublicKey, password);
    const senderKeypair = new Keypair(senderPublicKey, decryptedPrivateKey);

    // Create debit and credit transactions
    const debitTransaction = new Transaction("debit", amount, sender.publicKey, receiver.publicKey);
    const creditTransaction = new Transaction("credit", amount, sender.publicKey, receiver.publicKey);

    // Sign transactions
    KeypairService.sign(debitTransaction.toString(), senderKeypair.secretKey);
    KeypairService.sign(creditTransaction.toString(), senderKeypair.secretKey);

    // Save transactions and update accounts
    sender.balance -= amount;
    receiver.balance += amount;
    await sender.save();
    await receiver.save();
    await TransactionModel.create(debitTransaction);
    await TransactionModel.create(creditTransaction);

    return { sender, receiver };
  }
}

module.exports = AccountService;
