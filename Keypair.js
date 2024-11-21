const nacl = require('tweetnacl');
const bs58 = require('bs58');
const bip39 = require('bip39');
const crypto = require('crypto');

// Keypair class to handle crypto key operations
class Keypair {
  constructor(publicKey, secretKey) {
    this.publicKey = publicKey;
    this.privateKey = secretKey;
  }

  // Generate a new keypair 
  static generate() {
    try {
      const seedPhrase = bip39.generateMnemonic();
      const seed = bip39.mnemonicToSeedSync(seedPhrase).slice(0, 32); // Convert seed phrase to seed
      const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(seed);
      return {
        seedPhrase: seedPhrase,
        keypair: new Keypair(bs58.encode(publicKey), bs58.encode(secretKey))
      };
    } catch (error) {
      throw new Error(`Failed to generate key pair: ${error.message}`);
    }
  }

  // Generate a simple random public key (not related to any curve)
  static generatePublicKey() {
    // Generate a random 32-byte public key using crypto
    const publicKey = crypto.randomBytes(32);
    return bs58.encode(publicKey);  // Encode it in base58 to match current format
  }

  // Generate a keypair from a seed phrase
  static fromSeedPhrase(seedPhrase) {
    try {
      const seed = bip39.mnemonicToSeedSync(seedPhrase).slice(0, 32); // Convert seed phrase to seed
      const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(seed);
      return new Keypair(bs58.encode(publicKey), bs58.encode(secretKey));
    } catch (error) {
      throw new Error(`Failed to generate keypair from seed phrase: ${error.message}`);
    }
  }

  static sign(message, privateKey) {
    try {
      const messageData = new TextEncoder().encode(message);
      const privateKeyData = bs58.decode(privateKey);
      const signature = nacl.sign.detached(messageData, privateKeyData);
      return bs58.encode(signature);
    } catch (error) {
      throw new Error('Failed to sign message: ' + error.message);
    }
  }

  static verify(message, signature, publicKey) {
    try {
      const messageData = new TextEncoder().encode(message);
      const signatureData = bs58.decode(signature);
      const publicKeyData = bs58.decode(publicKey);
      return nacl.sign.detached.verify(messageData, signatureData, publicKeyData);
    } catch (error) {
      throw new Error('Failed to verify signature: ' + error.message);
    }
  }
 }
module.exports = Keypair;


