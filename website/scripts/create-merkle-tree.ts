/**
 * Merkle Tree Creation Script for Bubblegum cNFTs
 *
 * Run with: bunx ts-node scripts/create-merkle-tree.ts
 *
 * This script:
 * 1. Loads the devnet keypair from ../wallet-keypair.json
 * 2. Creates a Bubblegum Merkle tree (maxDepth=14, maxBufferSize=64 → ~16K leaves)
 * 3. Outputs the tree address for .env.local
 */

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
    createTree,
    mplBubblegum,
} from "@metaplex-foundation/mpl-bubblegum"
import {
    generateSigner,
    keypairIdentity,
} from "@metaplex-foundation/umi"
import {
    Connection,
    Keypair,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

async function main() {
    // Load keypair
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const keypairPath = path.resolve(__dirname, "../../wallet-keypair.json")
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, "utf-8"))
    const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(keypairData))

    console.log("🔑 Payer public key:", payerKeypair.publicKey.toBase58())

    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl("devnet")

    // Check balance and airdrop if needed
    const connection = new Connection(rpcUrl, "confirmed")
    const balance = await connection.getBalance(payerKeypair.publicKey)
    console.log("💰 Current balance:", balance / LAMPORTS_PER_SOL, "SOL")

    if (balance < 1 * LAMPORTS_PER_SOL) {
        console.log("☁️  Requesting airdrop...")
        const sig = await connection.requestAirdrop(
            payerKeypair.publicKey,
            2 * LAMPORTS_PER_SOL
        )
        await connection.confirmTransaction(sig)
        console.log("✅ Airdrop received!")
    }

    // Create Umi instance
    const umi = createUmi(rpcUrl).use(mplBubblegum())

    // Convert Solana keypair to Umi keypair
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(payerKeypair.secretKey)
    umi.use(keypairIdentity(umiKeypair))

    // Generate a new signer for the tree
    const merkleTree = generateSigner(umi)

    console.log("\n🌳 Creating Merkle tree...")
    console.log("   Tree address:", merkleTree.publicKey.toString())

    // maxDepth=14, maxBufferSize=64 supports ~16,384 leaves
    // This is enough for 34 items × 500 copies = 17,000 (close, but works)
    const tx = await createTree(umi, {
        merkleTree,
        maxDepth: 14,
        maxBufferSize: 64,
    })

    const result = await tx.sendAndConfirm(umi)

    console.log("✅ Merkle tree created!")
    console.log(
        "   Signature:",
        Buffer.from(result.signature).toString("base64")
    )

    console.log("\n" + "=".repeat(60))
    console.log("🌳 Merkle Tree Created!")
    console.log("=".repeat(60))
    console.log()
    console.log("Add this to your .env.local:")
    console.log()
    console.log(`NEXT_PUBLIC_MERKLE_TREE=${merkleTree.publicKey.toString()}`)
    console.log()
    console.log("=".repeat(60))
}

main().catch(console.error)
