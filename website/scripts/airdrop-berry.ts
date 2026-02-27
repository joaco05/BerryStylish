/**
 * Berry Token Airdrop Script
 *
 * Sends BRRY tokens from the treasury to a specified wallet.
 * Usage: bunx ts-node scripts/airdrop-berry.ts <WALLET_ADDRESS> [AMOUNT]
 * Default amount: 1000 BRRY
 */

import {
    Connection,
    Keypair,
    PublicKey,
    clusterApiUrl,
} from "@solana/web3.js"
import {
    getOrCreateAssociatedTokenAccount,
    transfer,
} from "@solana/spl-token"
import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

const BERRY_DECIMALS = 9

async function main() {
    const targetAddress = process.argv[2]
    const amount = parseInt(process.argv[3] || "1000", 10)

    if (!targetAddress) {
        console.error("Usage: bunx ts-node scripts/airdrop-berry.ts <WALLET_ADDRESS> [AMOUNT]")
        process.exit(1)
    }

    // Load treasury keypair
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const keypairPath = path.resolve(__dirname, "../../wallet-keypair.json")
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, "utf-8"))
    const payer = Keypair.fromSecretKey(Uint8Array.from(keypairData))

    const mintStr = process.env.NEXT_PUBLIC_BERRY_TOKEN_MINT
    if (!mintStr) {
        // Try reading from .env.local
        const envPath = path.resolve(__dirname, "../.env.local")
        const envContent = fs.readFileSync(envPath, "utf-8")
        const match = envContent.match(/NEXT_PUBLIC_BERRY_TOKEN_MINT=(.+)/)
        if (!match) {
            console.error("❌ BERRY_TOKEN_MINT not found in env")
            process.exit(1)
        }
        var mintAddress = match[1].trim()
    } else {
        var mintAddress = mintStr
    }

    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl("devnet")
    const connection = new Connection(rpcUrl, "confirmed")
    const mint = new PublicKey(mintAddress)
    const target = new PublicKey(targetAddress)

    console.log(`🍓 Airdropping ${amount} BRRY to ${targetAddress}`)

    // Get or create source token account
    const sourceAccount = await getOrCreateAssociatedTokenAccount(
        connection, payer, mint, payer.publicKey
    )

    // Get or create destination token account
    const destAccount = await getOrCreateAssociatedTokenAccount(
        connection, payer, mint, target
    )

    const rawAmount = BigInt(amount) * BigInt(10 ** BERRY_DECIMALS)

    const sig = await transfer(
        connection,
        payer,
        sourceAccount.address,
        destAccount.address,
        payer,
        rawAmount
    )

    console.log(`✅ Sent ${amount} BRRY!`)
    console.log(`   Signature: ${sig}`)
    console.log(`   To: ${targetAddress}`)
}

main().catch(console.error)
