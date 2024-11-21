const express = require('express');
const Keypair = require('./Keypair'); // Import the Keypair class

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to generate a new keypair
app.post('/generate-keypair', (req, res) => {
  try {
    const { seedPhrase, keypair } = Keypair.generate();
    res.json({
      seedPhrase,
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to generate a keypair from a seed phrase
app.post('/from-seed', (req, res) => {
  const { seedPhrase } = req.body;
  try {
    const keypair = Keypair.fromSeedPhrase(seedPhrase);
    res.json({
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to sign a message
app.post('/sign', (req, res) => {
  const { message, privateKey } = req.body;
  try {
    const signature = Keypair.sign(message, privateKey);
    res.json({ signature });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
 }); 

// Endpoint to verify a message signature
app.post('/verify', (req, res) => {
  const { message, signature, publicKey } = req.body;
  try {
    const isValid = Keypair.verify(message, signature, publicKey);
    res.json({ isValid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to encrypt a private key
app.post('/encrypt-private-key', async (req, res) => {
  const { privateKey, password } = req.body;
  try {
    const encryptedPrivateKey = await Keypair.encryptPrivateKey(privateKey, password);
    res.json({ encryptedPrivateKey });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to decrypt a private key
app.post('/decrypt-private-key', async (req, res) => {
  const { encryptedPrivateKey, password } = req.body;

  // Log the incoming data
  console.log("Received Encrypted Private Key:", encryptedPrivateKey);
  console.log("Received Password:", password);

  try {
    // Attempt to decrypt the private key
    const decryptedPrivateKey = await Keypair.decryptPrivateKey(encryptedPrivateKey, password);
    
    // Log the result if decryption is successful
    console.log("Decrypted Private Key:", decryptedPrivateKey);
    
    // Return the decrypted private key
    res.json({ decryptedPrivateKey });
  } catch (error) {
    // Log the error to the console for debugging
    console.error("Decryption Error:", error);

    // Send back the error message to the client
    res.status(400).json({ error: error.message });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
