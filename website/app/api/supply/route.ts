import { NextResponse } from "next/server"

/**
 * GET /api/supply
 *
 * Queries the DAS (Digital Asset Standard) API to count how many
 * compressed NFTs have been minted per item, using the treasury
 * wallet as the creator filter. Returns a map of itemName → mintCount.
 */
export async function GET() {
    const dasUrl = process.env.NEXT_PUBLIC_DAS_URL || process.env.NEXT_PUBLIC_RPC_URL
    const creatorAddress = process.env.NEXT_PUBLIC_TREASURY_PUBKEY

    if (!dasUrl || !creatorAddress) {
        return NextResponse.json({})
    }

    try {
        // Fetch all assets created by our treasury (the tree authority)
        const response = await fetch(dasUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: "supply-check",
                method: "getAssetsByCreator",
                params: {
                    creatorAddress,
                    onlyVerified: false,
                    page: 1,
                    limit: 1000,
                },
            }),
        })

        const data = await response.json()
        const items = data?.result?.items || []

        // Count mints per item name
        const counts: Record<string, number> = {}
        for (const asset of items) {
            const name = asset?.content?.metadata?.name
            if (name) {
                counts[name] = (counts[name] || 0) + 1
            }
        }

        return NextResponse.json(counts)
    } catch (error) {
        console.error("DAS supply query error:", error)
        return NextResponse.json({})
    }
}
