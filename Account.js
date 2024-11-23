const Keypair = require('./Keypair');
const Transaction = require('./Transaction');
const TransactionHistory = require('./TransactionHistory');

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

    // Record the initial funding as a credit transaction
    const transaction = new Transaction('credit', initialBalance, publicKey);
    transaction.sign(privateKey);  // Sign the transaction
    newAccount.history.addTransaction(transaction);

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
    transaction.sign(this.keypair.privateKey);  // Sign the transaction
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
      transaction.sign(this.keypair.privateKey);  // Sign the transaction
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
      
      // Create and sign a transaction for sender
      const senderTransaction = new Transaction('debit', amount, this.publicKey, recipientAccount.publicKey);
      senderTransaction.sign(this.keypair.privateKey);  // Sign the transaction
      this.history.addTransaction(senderTransaction);

      // Create and sign a transaction for receiver
      const receiverTransaction = new Transaction('credit', amount, recipientAccount.publicKey, this.publicKey);
      receiverTransaction.sign(recipientAccount.keypair.privateKey);  // Sign the transaction
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

// // Simulate creating a Keypair
// const keypair = Keypair.generate();

// // Create account using public and private keys from the Keypair with a positive initial balance
// try {
//   const account = Account.createAccount(keypair.keypair.publicKey, keypair.keypair.privateKey, 1000);

//   // Credit some amount to the account
//   account.credit(500);

//   // Debit some amount from the account
//   account.debit(200);

//   // View balance and transaction history
//   account.viewBalance();
//   account.viewHistory();
// } catch (error) {
//   console.error(error.message);
// }

module.exports = Account;
