import { NextResponse } from "next/server"

/**
 * GET /api/token-metadata
 * Returns the off-chain metadata JSON for the Berry (BRRY) token.
 * Referenced by the on-chain token metadata URI.
 */
export async function GET() {
    return NextResponse.json({
        name: "Berry",
        symbol: "BRRY",
        description:
            "Berry (BRRY) is the native token of BerryStylish — an NFT dress-up game and social network on Solana. Use BRRY to buy exclusive wearable NFTs in the Berry Store.",
        image: "https://berrystylish.social/sprites/body-base.svg",
    })
}
