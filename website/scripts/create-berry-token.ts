/**
 * Berry Token (BRRY) Creation Script
 *
 * Run with: bunx ts-node scripts/create-berry-token.ts
 *
 * This script:
 * 1. Loads the devnet keypair from ../wallet-keypair.json
 * 2. Airdrops SOL if needed
 * 3. Creates an SPL token mint (9 decimals)
 * 4. Mints initial supply to the keypair's token account
 * 5. Outputs the mint address for .env.local
 */

import {
    Connection,
    Keypair,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
} from "@solana/spl-token"
import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

const BERRY_DECIMALS = 9
const INITIAL_SUPPLY = 1_000_000 // 1 million BRRY

async function main() {
    // Load keypair
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const keypairPath = path.resolve(__dirname, "../../wallet-keypair.json")
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, "utf-8"))
    const payer = Keypair.fromSecretKey(Uint8Array.from(keypairData))

    console.log("🔑 Payer public key:", payer.publicKey.toBase58())

    // Connect to devnet
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl("devnet")
    const connection = new Connection(rpcUrl, "confirmed")

    // Check balance and airdrop if needed
    const balance = await connection.getBalance(payer.publicKey)
    console.log("💰 Current balance:", balance / LAMPORTS_PER_SOL, "SOL")

    if (balance < 0.5 * LAMPORTS_PER_SOL) {
        console.log("☁️  Requesting airdrop...")
        const sig = await connection.requestAirdrop(
            payer.publicKey,
            2 * LAMPORTS_PER_SOL
        )
        await connection.confirmTransaction(sig)
        console.log("✅ Airdrop received!")
    }

    // Create token mint
    console.log("\n🍓 Creating Berry Token mint...")
    const mint = await createMint(
        connection,
        payer,
        payer.publicKey, // mint authority
        payer.publicKey, // freeze authority
        BERRY_DECIMALS
    )

    console.log("✅ Mint created:", mint.toBase58())

    // Create associated token account
    console.log("📦 Creating token account...")
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        payer.publicKey
    )

    console.log("✅ Token account:", tokenAccount.address.toBase58())

    // Mint initial supply
    const supplyRaw = BigInt(INITIAL_SUPPLY) * BigInt(10 ** BERRY_DECIMALS)
    console.log(`\n🌿 Minting ${INITIAL_SUPPLY.toLocaleString()} BRRY...`)

    await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        payer,
        supplyRaw
    )

    console.log("✅ Minted successfully!")

    console.log("\n" + "=".repeat(60))
    console.log("🍓 Berry Token Created!")
    console.log("=".repeat(60))
    console.log()
    console.log("Add these to your .env.local:")
    console.log()
    console.log(`NEXT_PUBLIC_BERRY_TOKEN_MINT=${mint.toBase58()}`)
    console.log(`NEXT_PUBLIC_TREASURY_PUBKEY=${payer.publicKey.toBase58()}`)
    console.log()
    console.log("=".repeat(60))
}

main().catch(console.error)
