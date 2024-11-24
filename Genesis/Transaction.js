import { PublicKey } from './PublicKey.js';
class Transaction {
  constructor({
    feePayer = null,
    instructions = [],
    recentBlockhash = null,
    lastValidBlockHeight = null,
    minNonceContextSlot = null,
    nonceInfo = null,
  } = {}) {
    this.feePayer = feePayer;
    this.instructions = instructions;
    this.recentBlockhash = recentBlockhash;
    this.lastValidBlockHeight = lastValidBlockHeight;
    this.minNonceContextSlot = minNonceContextSlot;
    this.nonceInfo = nonceInfo;
    this.signatures = [];
  }

  // Adds an instruction to the transaction
  add(instruction) {
    this.instructions.push(instruction);
    return this; // to allow chaining
  }

  // Adds a signature to the transaction
  addSignature(pubkey, signature) {
    this.signatures.push({ pubkey, signature });
    return this; // to allow chaining
  }

  // Compile message based on the instructions, recent blockhash, etc.
  compileMessage() {
    // Here, you would serialize the transaction data into a message format for Solana
    return {
      feePayer: this.feePayer,
      instructions: this.instructions,
      recentBlockhash: this.recentBlockhash,
      signatures: this.signatures,
    };
  }

  // Estimate the fee for the transaction
  getEstimatedFee() {
    // Estimate based on the number of instructions or some other metric
    return this.instructions.length * 5000; // Dummy fee estimation
  }

  // Partially sign the transaction (e.g., by a signer that is not the fee payer)
  partialSign(keypair) {
    this.signatures.push({ pubkey: keypair.publicKey, signature: keypair.secretKey });
    return this;
  }

  // Serialize the entire transaction into a format that can be sent
  serialize() {
    const message = this.compileMessage();
    return Buffer.from(JSON.stringify(message)); // A simplified serialization
  }

  // Serialize only the message part of the transaction
  serializeMessage() {
    const message = this.compileMessage();
    return Buffer.from(JSON.stringify(message)); // Simplified message serialization
  }

  // Set the signers for the transaction
  setSigners(signers) {
    this.signatures = signers.map((signer) => ({
      pubkey: signer.publicKey,
      signature: signer.secretKey,
    }));
  }

  // Sign the transaction with a keypair
  sign(keypair) {
    this.signatures.push({
      pubkey: keypair.publicKey,
      signature: keypair.secretKey,
    });
    return this;
  }

  // Verify all signatures of the transaction
  verifySignatures() {
    // Simplified verification (you could implement more complex checks)
    return this.signatures.every((sig) => {
      // For simplicity, we assume signatures are valid if pubkey exists
      return sig.pubkey instanceof PublicKey && sig.signature.length > 0;
    });
  }

  // Convert from an existing transaction object (e.g., deserialization)
  static from(serializedTransaction) {
    const data = JSON.parse(serializedTransaction.toString());
    const transaction = new Transaction(data);
    return transaction;
  }

  // Populate the transaction with the fee payer and blockhash
  populate(feePayer, blockhash) {
    this.feePayer = feePayer;
    this.recentBlockhash = blockhash;
  }
}


export default Transaction;