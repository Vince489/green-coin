const nacl = require('tweetnacl');
const bs58 = require('bs58');
const bip39 = require('bip39');

class KeypairService {
  // Generate a new keypair from a random mnemonic
  static generateKeypair() {
    const seedPhrase = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(seedPhrase).slice(0, 32);
    const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(seed);
    return {
      seedPhrase,
      keypair: {
        publicKey: bs58.encode(publicKey),
        secretKey: bs58.encode(secretKey),
      }
    };
  }

  // Generate keypair from a seed phrase
  static fromSeedPhrase(seedPhrase) {
    const seed = bip39.mnemonicToSeedSync(seedPhrase).slice(0, 32);
    const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(seed);
    return {
      publicKey: bs58.encode(publicKey),
      secretKey: bs58.encode(secretKey),
    };
  }

  // Sign a message with a private key
  static sign(message, privateKey) {
    const messageData = new TextEncoder().encode(message);
    const privateKeyData = bs58.decode(privateKey);
    const signature = nacl.sign.detached(messageData, privateKeyData);
    return bs58.encode(signature);
  }

  // Verify a signature
  static verify(message, signature, publicKey) {
    const messageData = new TextEncoder().encode(message);
    const signatureData = bs58.decode(signature);
    const publicKeyData = bs58.decode(publicKey);
    return nacl.sign.detached.verify(messageData, signatureData, publicKeyData);
  }
}

module.exports = KeypairService;
