import { NextRequest, NextResponse } from "next/server"
import {
    Connection,
    Keypair,
    PublicKey,
} from "@solana/web3.js"
import {
    getOrCreateAssociatedTokenAccount,
    mintTo,
} from "@solana/spl-token"
import * as fs from "fs"
import * as path from "path"

export async function POST(req: NextRequest) {
    try {
        const { walletAddress, type } = await req.json()

        if (!walletAddress || !type) {
            return NextResponse.json(
                { error: "walletAddress and type ('brry') are required" },
                { status: 400 }
            )
        }

        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com"
        const connection = new Connection(rpcUrl, "confirmed")
        const toPubkey = new PublicKey(walletAddress)

        // Load server keypair
        const keypairPath = path.resolve(process.cwd(), "../wallet-keypair.json")
        if (!fs.existsSync(keypairPath)) {
            return NextResponse.json(
                { error: "Server wallet keypair not found. Cannot operate faucet." },
                { status: 500 }
            )
        }
        const keypairData = JSON.parse(fs.readFileSync(keypairPath, "utf-8"))
        const serverKeypair = Keypair.fromSecretKey(Uint8Array.from(keypairData))

        if (type === "brry") {
            // Mint 1000 BRRY
            const mintAddressStr = process.env.NEXT_PUBLIC_BERRY_TOKEN_MINT
            if (!mintAddressStr) {
                return NextResponse.json(
                    { error: "BRRY Mint address not configured" },
                    { status: 500 }
                )
            }

            const mintPubkey = new PublicKey(mintAddressStr)

            // 1. Get/Create Associated Token Account for the user
            const userAta = await getOrCreateAssociatedTokenAccount(
                connection,
                serverKeypair,
                mintPubkey,
                toPubkey
            )

            // 2. Mint tokens to the user's ATA
            const amountToMint = 1000 * Math.pow(10, 9) // Assuming 9 decimals
            const signature = await mintTo(
                connection,
                serverKeypair,
                mintPubkey,
                userAta.address,
                serverKeypair.publicKey, // server is mint authority
                amountToMint
            )

            return NextResponse.json({ success: true, signature, amount: 1000, currency: "BRRY" })
        } else {
            return NextResponse.json(
                { error: "Invalid faucet type. Must be 'brry'" },
                { status: 400 }
            )
        }
    } catch (error: any) {
        console.error("Faucet error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to process faucet request" },
            { status: 500 }
        )
    }
}
