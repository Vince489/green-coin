import Keypair from "./Keypair.js";
import Transaction from "./Transaction.js";
import SystemProgram from "./SystemProgram.js";
import { PublicKey } from "./PublicKey.js"; // Import PublicKey

// Step 1: Create sender and receiver keypairs
const senderKeypair = new Keypair();
const receiverKeypair = new Keypair();

// Step 2: Set up a valid programId (not zero, use an actual program id or SystemProgram)
const programId = new PublicKey('11111111111111111111111111111111');  // Example valid program ID

// Step 3: Create a transfer instruction with the correct programId
const transferInstruction = SystemProgram.transfer({
  fromPubkey: senderKeypair.publicKey,
  toPubkey: receiverKeypair.publicKey,
  vinnies: 100000000,  // For example, transfer 1 unit (100000000 is 1 VRT equivalent)
  programId: programId // Make sure to set programId here
});

// Step 4: Create a new transaction and add the transfer instruction
const transaction = new Transaction();
transaction.add(transferInstruction);

// Step 5: Include a recent blockhash (replace with a valid blockhash from the network or test)
const recentBlockhash = 'blockhash123456'; // Example recent blockhash for testing
transaction.recentBlockhash = recentBlockhash;

// Step 6: Sign the transaction with the sender's private key
transaction.sign(senderKeypair);

// Log transaction details for verification
console.log('Transaction Details:');
console.log('Sender Public Key:', senderKeypair.publicKey.toBase58());
console.log('Receiver Public Key:', receiverKeypair.publicKey.toBase58());
console.log('Transaction:', JSON.stringify(transaction, null, 2));

// Step 7: Assuming you'd send this to the network or continue with processing it locally
console.log('Transaction Signed:', transaction.signatures);
