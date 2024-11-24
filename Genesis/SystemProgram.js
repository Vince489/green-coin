import { PublicKey } from "./PublicKey.js";
import TransactionInstruction from "./TransactionInstruction.js";
import BN from "bn.js";
import { Buffer } from "buffer";

class SystemProgram {
  static programId = new PublicKey("11111111111111111111111111111111");

  static transfer({ fromPubkey, toPubkey, vinnies }) {
    const data = Buffer.from([0, ...new BN(vinnies).toArray("le", 8)]); // Example data format

    const keys = [
      { pubkey: fromPubkey, isSigner: true, isWritable: true },
      { pubkey: toPubkey, isSigner: false, isWritable: true },
    ];

    return new TransactionInstruction({
      programId: SystemProgram.programId,
      keys: keys,
      data: data,
    });
  }

  static createAccount({ fromPubkey, newAccountPubkey, vinnies, space, programId }) {
    const data = Buffer.from([
      1, // Create account instruction type
      ...new BN(vinnies).toArray("le", 8),
      ...new BN(space).toArray("le", 4),
      ...programId.toBuffer(),
    ]);

    const keys = [
      { pubkey: fromPubkey, isSigner: true, isWritable: true },
      { pubkey: newAccountPubkey, isSigner: false, isWritable: true },
    ];

    return new TransactionInstruction({
      programId: SystemProgram.programId,
      keys: keys,
      data: data,
    });
  }

  // Other methods would follow a similar pattern for creating TransactionInstructions.
}

export default SystemProgram;