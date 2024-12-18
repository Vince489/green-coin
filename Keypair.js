const bip39 = require('bip39');
const nacl = require('tweetnacl');
const bs58 = require('bs58');

class Keypair {
  constructor(publicKey, secretKey) {
    this.publicKey = publicKey;
    this.privateKey = secretKey;
  }

  static generate() {
    const seedPhrase = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(seedPhrase).slice(0, 32);
    const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(seed);
    return {
      seedPhrase,
      keypair: new Keypair(bs58.encode(publicKey), bs58.encode(secretKey)),
    };
  }

  static fromSeedPhrase(seedPhrase) {
    const seed = bip39.mnemonicToSeedSync(seedPhrase).slice(0, 32);
    const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(seed);
    return new Keypair(bs58.encode(publicKey), bs58.encode(secretKey));
  }

  static signMessage(message, privateKey) {
    const messageData = new TextEncoder().encode(message);
    const privateKeyData = bs58.decode(privateKey);
    const signature = nacl.sign.detached(messageData, privateKeyData);
    return bs58.encode(signature);
  }

  static verifyMessage(message, signature, publicKey) {
    const messageData = new TextEncoder().encode(message);
    const signatureData = bs58.decode(signature);
    const publicKeyData = bs58.decode(publicKey);
    return nacl.sign.detached.verify(messageData, signatureData, publicKeyData);
  }
}

module.exports = Keypair;
