import { PublicKey } from './PublicKey.js';

class TransactionInstruction {
  constructor({ programId, keys = [], data = Buffer.alloc(0) }) {
    if (!programId) {
      throw new Error("TransactionInstruction: programId is required.");
    }

    // Convert programId into a PublicKey instance
    this.programId = new PublicKey(programId._key); 
    this.keys = keys.map((key) => ({
      pubkey: new PublicKey(key.pubkey._key), // Convert each key to PublicKey instance
      isSigner: key.isSigner,
      isWritable: key.isWritable,
    }));
    this.data = data;
  }

  /**
   * Adds a key (account) to the instruction.
   */
  addKey(pubkey, isSigner = false, isWritable = false) {
    if (!pubkey) {
      throw new Error("TransactionInstruction: pubkey is required.");
    }

    this.keys.push({ pubkey, isSigner, isWritable });
  }

  /**
   * Converts the instruction into a plain object for transactions.
   */
  toInstruction() {
    return {
      programId: this.programId.toString(), // Export the programId as a string
      keys: this.keys.map((key) => ({
        pubkey: key.pubkey.toString(), // Export each pubkey as a string
        isSigner: key.isSigner,
        isWritable: key.isWritable,
      })),
      data: this.data,
    };
  }

  /**
   * Deserialize the JSON into a TransactionInstruction object
   * @param {Object} json The JSON data to deserialize
   * @returns {TransactionInstruction} The deserialized TransactionInstruction instance
   */
  static fromJson(json) {
    const programId = new PublicKey(json.programId._key);
    const keys = json.keys.map((key) => ({
      pubkey: new PublicKey(key.pubkey._key),
      isSigner: key.isSigner,
      isWritable: key.isWritable,
    }));
    const data = Buffer.from(json.data);
    
    return new TransactionInstruction({
      programId,
      keys,
      data,
    });
  }
}

export default TransactionInstruction;
