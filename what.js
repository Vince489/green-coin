const Keypair = require('./Keypair');

// Transaction class to represent individual transactions
class Transaction {
  constructor(type, amount, sender, receiver = null) {
    this.type = type;  // 'credit' or 'debit'
    this.amount = amount;
    this.timestamp = new Date().toISOString();
    this.sender = sender;  // Public key of the sender
    this.receiver = receiver;  // Public key of the receiver (only needed for transfers)
  }
}

// TransactionHistory class to manage and store transactions
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

// Account class to manage account operations
class Account {
  constructor(publicKey, privateKey, initialBalance) {
    if (initialBalance <= 0) {
      throw new Error('Account must be initialized with a positive balance.');
    }

    this.keypair = new Keypair(publicKey, privateKey);  // The Keypair instance
    this.publicKey = publicKey;
    this.balance = initialBalance;
    this.history = new TransactionHistory();  // Store transaction history
  }

  // Create an account with an initial balance (must be positive)
  static createAccount(publicKey, privateKey, initialBalance) {
    if (initialBalance <= 0) {
      throw new Error('Account must be initialized with a positive balance.');
    }

    const newAccount = new Account(publicKey, privateKey, initialBalance);
    console.log(`Account for ${publicKey} created with balance: ${initialBalance}`);
    return newAccount;
  }

  // Credit the account (add funds)
  credit(amount) {
    if (amount <= 0) {
      console.log('Amount to credit must be positive.');
      return;
    }
    this.balance += amount;
    const transaction = new Transaction('credit', amount, this.publicKey);
    this.history.addTransaction(transaction);
    console.log(`Credited ${amount} to ${this.publicKey}. New balance: ${this.balance}`);
  }

  // Debit the account (subtract funds)
  debit(amount) {
    if (amount <= 0) {
      console.log('Amount to debit must be positive.');
      return;
    }
    if (this.balance >= amount) {
      this.balance -= amount;
      const transaction = new Transaction('debit', amount, this.publicKey);
      this.history.addTransaction(transaction);
      console.log(`Debited ${amount} from ${this.publicKey}. New balance: ${this.balance}`);
    } else {
      console.log(`Insufficient balance for debit of ${amount}`);
    }
  }

  // Transfer funds to another account
  transfer(amount, recipientAccount) {
    if (amount <= 0) {
      console.log('Amount to transfer must be positive.');
      return;
    }
    if (this.balance >= amount) {
      this.balance -= amount;
      recipientAccount.balance += amount;
      
      // Create a transaction for sender
      const senderTransaction = new Transaction('debit', amount, this.publicKey, recipientAccount.publicKey);
      this.history.addTransaction(senderTransaction);

      // Create a transaction for receiver
      const receiverTransaction = new Transaction('credit', amount, recipientAccount.publicKey, this.publicKey);
      recipientAccount.history.addTransaction(receiverTransaction);

      console.log(`Transferred ${amount} from ${this.publicKey} to ${recipientAccount.publicKey}`);
    } else {
      console.log(`Insufficient balance for transfer of ${amount}`);
    }
  }

  // View account balance
  viewBalance() {
    console.log(`Balance for ${this.publicKey}: ${this.balance}`);
  }

  // View transaction history
  viewHistory() {
    console.log(`Transaction History for ${this.publicKey}:`);
    console.log(this.history.viewHistory());
  }
}

// Example usage

// Simulate creating a Keypair
const keypair = Keypair.generate();

// Create two accounts using public and private keys from the Keypair with a positive initial balance
try {
  const account1 = Account.createAccount(keypair.keypair.publicKey, keypair.keypair.privateKey, 1000);
  const account2 = Account.createAccount(Keypair.generate().keypair.publicKey, Keypair.generate().keypair.privateKey, 500);

  // Credit some amount to account1
  account1.credit(500);

  // Debit some amount from account1
  account1.debit(200);

  // Transfer funds from account1 to account2
  account1.transfer(300, account2);

  // View balance and transaction history for both accounts
  account1.viewBalance();
  account1.viewHistory();
  account2.viewBalance();
  account2.viewHistory();
} catch (error) {
  console.error(error.message);
}

module.exports = Account;
