import * as bip39 from 'bip39';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

/**
 * Function to generate a keypair from a mnemonic
 * @param {string} mnemonic The BIP39 mnemonic phrase
 * @returns {Object} An object containing the mnemonic, seed, public key, and secret key
 */
function generateKeypairFromMnemonic(mnemonic) {
  // Ensure the mnemonic is valid
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  // Derive the seed from the mnemonic
  const seed = bip39.mnemonicToSeedSync(mnemonic); // Use the mnemonic to generate the seed (32 bytes)

  // Derive the Ed25519 keypair from the seed (the seed is used as a 32-byte input for Ed25519)
  const keypair = nacl.sign.keyPair.fromSeed(seed.slice(0, 32)); // Only use the first 32 bytes for Ed25519

  return {
    mnemonic,
    seed: seed.toString('hex'),
    publicKey: keypair.publicKey,
    secretKey: keypair.secretKey
  };
}

/**
 * Function to recover a keypair from a mnemonic
 * @param {string} mnemonic The BIP39 mnemonic phrase
 * @returns {Object} An object containing the public key and secret key
 */
function recoverKeypairFromMnemonic(mnemonic) {
  return generateKeypairFromMnemonic(mnemonic);  // Essentially the same as generating it, as the mnemonic directly corresponds to the keypair
}

// Example mnemonic (replace with your generated one)
const mnemonic = 'viable impact today cloth various reunion sibling boil rule rate creek tribe';

// Generate the keypair from the mnemonic
const keypair = generateKeypairFromMnemonic(mnemonic);

// Log the public key as Base58
console.log('Generated Public Key (Base58):', bs58.encode(keypair.publicKey));

// Log the secret key as a Uint8Array
console.log('Generated Secret Key (Uint8Array):', keypair.secretKey);

// Log the secret key as Base58
console.log('Generated Secret Key (Base58):', bs58.encode(keypair.secretKey));

// Now recover the keypair from the mnemonic
const recoveredKeypair = recoverKeypairFromMnemonic(mnemonic);

// Log the recovered public key as Base58
console.log('Recovered Public Key (Base58):', bs58.encode(recoveredKeypair.publicKey));

// Verify the keys match
const keysMatch = bs58.encode(keypair.publicKey) === bs58.encode(recoveredKeypair.publicKey);
console.log('Keys match:', keysMatch);
