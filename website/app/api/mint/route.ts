import { NextRequest, NextResponse } from "next/server"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
    mintV1,
    mplBubblegum,
} from "@metaplex-foundation/mpl-bubblegum"
import {
    publicKey as umiPublicKey,
    none,
    keypairIdentity,
} from "@metaplex-foundation/umi"
import * as fs from "fs"
import * as path from "path"

export async function POST(request: NextRequest) {
    try {
        const { itemId, itemName, leafOwner } = await request.json()

        if (!itemId || !itemName || !leafOwner) {
            return NextResponse.json(
                { error: "Missing itemId, itemName, or leafOwner" },
                { status: 400 }
            )
        }

        // Use production domain for metadata URI
        const metadataUri = `https://berrystylish.social/api/metadata/${itemId}`

        const rpcUrl =
            process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com"
        const treeAddress = process.env.NEXT_PUBLIC_MERKLE_TREE || ""

        if (!treeAddress) {
            return NextResponse.json(
                { error: "Merkle tree not configured" },
                { status: 500 }
            )
        }

        // Load the tree creator keypair (server-side only)
        const keypairPath = path.resolve(process.cwd(), "../wallet-keypair.json")
        const keypairData = JSON.parse(fs.readFileSync(keypairPath, "utf-8"))

        // Create Umi instance with the tree authority as identity
        const umi = createUmi(rpcUrl).use(mplBubblegum())
        const umiKeypair = umi.eddsa.createKeypairFromSecretKey(
            Uint8Array.from(keypairData)
        )
        umi.use(keypairIdentity(umiKeypair))

        // Mint the cNFT to the user's wallet (leafOwner)
        const result = await mintV1(umi, {
            leafOwner: umiPublicKey(leafOwner),
            merkleTree: umiPublicKey(treeAddress),
            metadata: {
                name: itemName,
                uri: metadataUri,
                sellerFeeBasisPoints: 500,
                collection: none(),
                creators: [
                    {
                        address: umiKeypair.publicKey,
                        verified: false,
                        share: 100,
                    },
                ],
            },
        }).sendAndConfirm(umi)

        return NextResponse.json({
            success: true,
            signature: Buffer.from(result.signature).toString("base64"),
            leafOwner,
        })
    } catch (error: any) {
        console.error("Mint API error:", error)
        return NextResponse.json(
            { error: error.message || "Minting failed" },
            { status: 500 }
        )
    }
}
