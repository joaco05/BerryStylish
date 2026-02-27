/**
 * Add metadata to existing Berry Token (BRRY)
 *
 * Adds name, symbol, and URI metadata using the Metaplex Token Metadata program.
 * Run with: bunx ts-node scripts/set-token-metadata.ts
 */

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
    createMetadataAccountV3,
    mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata"
import {
    publicKey as umiPublicKey,
    keypairIdentity,
    some,
    none,
} from "@metaplex-foundation/umi"
import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

async function main() {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    // Load keypair
    const keypairPath = path.resolve(__dirname, "../../wallet-keypair.json")
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, "utf-8"))

    // Read mint address from .env.local
    const envPath = path.resolve(__dirname, "../.env.local")
    const envContent = fs.readFileSync(envPath, "utf-8")
    const mintMatch = envContent.match(/NEXT_PUBLIC_BERRY_TOKEN_MINT=(.+)/)
    if (!mintMatch) {
        console.error("❌ BERRY_TOKEN_MINT not found in .env.local")
        process.exit(1)
    }
    const mintAddress = mintMatch[1].trim()

    const rpcUrl = envContent.match(/NEXT_PUBLIC_RPC_URL=(.+)/)?.[1]?.trim()
        || "https://api.devnet.solana.com"

    console.log("🍓 Setting Berry Token metadata...")
    console.log(`   Mint: ${mintAddress}`)
    console.log(`   RPC: ${rpcUrl}`)

    // Create Umi instance
    const umi = createUmi(rpcUrl).use(mplTokenMetadata())
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(
        Uint8Array.from(keypairData)
    )
    umi.use(keypairIdentity(umiKeypair))

    const mint = umiPublicKey(mintAddress)

    try {
        await createMetadataAccountV3(umi, {
            mint,
            mintAuthority: umi.identity,
            payer: umi.identity,
            updateAuthority: umi.identity.publicKey,
            data: {
                name: "Berry",
                symbol: "BRRY",
                uri: "https://berrystylish.social/api/token-metadata",
                sellerFeeBasisPoints: 0,
                creators: some([
                    {
                        address: umi.identity.publicKey,
                        verified: true,
                        share: 100,
                    },
                ]),
                collection: none(),
                uses: none(),
            },
            isMutable: true,
            collectionDetails: none(),
        }).sendAndConfirm(umi)

        console.log("✅ Token metadata set!")
        console.log("   Name: Berry")
        console.log("   Symbol: BRRY")
    } catch (error: any) {
        if (error.message?.includes("already in use")) {
            console.log("ℹ️  Metadata account already exists. Skipping creation.")
        } else {
            throw error
        }
    }
}

main().catch(console.error)
