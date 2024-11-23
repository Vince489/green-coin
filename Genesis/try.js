import { Keypair } from './Keypair.js';
import bs58 from 'bs58';

// Example: Create a new keypair, either from a provided mnemonic or generated internally
const keypair = new Keypair(); // No mnemonic passed, so it will generate one

// Log the generated mnemonic
console.log('Generated Mnemonic:', keypair.getMnemonic());

// Log the public key as Base58
console.log('Generated Public Key (Base58):', bs58.encode(keypair.publicKey.toBytes()));

// Log the secret key as Base58
console.log('Generated Secret Key (Base58):', bs58.encode(keypair.secretKey));

// Now recover the keypair from the mnemonic
const recoveredKeypair = keypair.recoverFromMnemonic();

// Log the recovered public key as Base58
console.log('Recovered Public Key (Base58):', bs58.encode(recoveredKeypair.publicKey.toBytes()));

// Verify the keys match
const keysMatch = bs58.encode(keypair.publicKey.toBytes()) === bs58.encode(recoveredKeypair.publicKey.toBytes());
console.log('Keys match:', keysMatch);
