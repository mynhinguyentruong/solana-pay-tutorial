import {
  createTransferCheckedInstruction,
  getMint,
  getOrCreateAssociatedTokenAccount,
  NATIVE_MINT, // If you would like to use SOL
} from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

// Devnet 'fake' USDC, you can get these tokens from https://spl-token-faucet.com/
const FAKE_USDC_ADDRESS: PublicKey = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
);

const MERCHANT_WALLET = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.MERCHANT_WALLET as string))
).publicKey;
const MERCHANT_WALLET_KEYPAIR = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.MERCHANT_WALLET as string))
);

console.log("Merchant wallet address: ", MERCHANT_WALLET.toBase58());

export async function GET() {
  return NextResponse.json({
    label: "The Incredible Store",
    icon: "https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png",
  });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const total = parseInt(searchParams.get("total") as string);
  const devnet = clusterApiUrl("devnet");
  const connection = new Connection(devnet);
  const body = await request.json();

  const accountField = body?.account!!;

  const payer = new PublicKey(accountField);
  const payerATA = await getOrCreateAssociatedTokenAccount(
    connection,
    MERCHANT_WALLET_KEYPAIR,
    FAKE_USDC_ADDRESS,
    payer
  );
  console.log({ payerATA });

  const merchantATA = await getOrCreateAssociatedTokenAccount(
    connection,
    MERCHANT_WALLET_KEYPAIR,
    FAKE_USDC_ADDRESS,
    MERCHANT_WALLET
  );
  console.log({ merchantATA });

  const mint = await getMint(connection, FAKE_USDC_ADDRESS);

  const splTransferIx = createTransferCheckedInstruction(
    payerATA.address,
    FAKE_USDC_ADDRESS,
    merchantATA.address,
    payer,
    BigInt(Math.pow(10, mint.decimals) * total),
    mint.decimals
  );
  const references = [new Keypair().publicKey];
  for (const pubkey of references) {
    splTransferIx.keys.push({ pubkey, isWritable: false, isSigner: false });
    console.log({ pubkey });
  }
  console.log({ splTransferIx });

  const transaction = new Transaction().add(splTransferIx);

  const blockhash = (await connection.getLatestBlockhash()).blockhash;

  transaction.recentBlockhash = blockhash;
  transaction.feePayer = new PublicKey(0);

  const serializedTransaction = transaction.serialize({
    verifySignatures: false,
    requireAllSignatures: false,
  });

  const base64Transaction = serializedTransaction.toString("base64");
  const message = "Thank you for your purchase";
  console.log({ base64Transaction });

  return NextResponse.json({ transaction: base64Transaction, message });
}
