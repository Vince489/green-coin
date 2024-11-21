const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config(); // Load environment variables

// Define the Account schema
const accountSchema = new mongoose.Schema({
  publicKey: { type: String, required: true, unique: true },
  encryptedPrivateKey: { type: String, required: true }, // Encrypted private key
  balance: { type: Number, required: true, default: 0 },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }], // Array of transaction IDs
});

// Constants for encryption
const algorithm = "aes-256-cbc";
const ivLength = 16; // AES requires a 16-byte IV
const globalPassword = process.env.GLOBAL_ENCRYPTION_PASSWORD;

// Encrypt the private key before saving
accountSchema.methods.encryptPrivateKey = function (privateKey) {
  if (!globalPassword) {
    throw new Error("Global encryption password is not defined in .env");
  }

  const key = crypto.createHash("sha256").update(globalPassword).digest("base64").substr(0, 32); // Generate a 32-byte key
  const iv = crypto.randomBytes(ivLength); // Generate a random IV
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return IV + encrypted data
  return `${iv.toString("hex")}:${encrypted}`;
};

// Decrypt the private key when needed
accountSchema.methods.decryptPrivateKey = function () {
  if (!globalPassword) {
    throw new Error("Global encryption password is not defined in .env");
  }

  const [ivHex, encryptedData] = this.encryptedPrivateKey.split(":");
  const key = crypto.createHash("sha256").update(globalPassword).digest("base64").substr(0, 32);
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
