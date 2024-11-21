const Keypair = require('./Keypair');
const Transaction = require('./Transaction');
const Account = require('./Account');
// Generate keypair for sender and receiver
const senderKeypair = Keypair.generate();
const receiverKeypair = Keypair.generate();

// Create accounts for sender and receiver
const senderAccount = Account.createAccount(senderKeypair.publicKey, senderKeypair.privateKey, 1000);
const receiverAccount = Account.createAccount(receiverKeypair.publicKey, receiverKeypair.privateKey, 500);

// Create a transaction of 200 from sender to receiver
const transaction = new Transaction(senderAccount, receiverAccount, 200);

// Sign the transaction with the sender's private key
transaction.sign();

// Execute the transaction (debit sender and credit receiver)
transaction.execute();

// View updated balances and histories
senderAccount.viewBalance();
receiverAccount.viewBalance();
senderAccount.viewHistory();
receiverAccount.viewHistory();
