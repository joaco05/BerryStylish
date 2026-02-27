import { NextRequest, NextResponse } from "next/server"
import { createContent, getContents } from "@/lib/tapestry"
import { fetchOwnedNFTs } from "@/lib/fetch-owned-nfts"

export async function POST(req: NextRequest) {
    try {
        const { profileId, title, description, equippedItems, outfitType, walletAddress } =
            await req.json()

        if (!profileId || !equippedItems) {
            return NextResponse.json(
                { error: "profileId and equippedItems are required" },
                { status: 400 }
            )
        }

        if (!walletAddress) {
            return NextResponse.json(
                { error: "walletAddress is required to verify NFT ownership" },
                { status: 400 }
            )
        }

        // Verify NFT ownership via DAS API
        const ownedNFTs = await fetchOwnedNFTs(walletAddress)

        // equippedItems is expected to be a Partial Record object, e.g. { "top": "img_url..." }
        // The values are the image URLs.
        const equippedImages = Object.values(equippedItems) as string[]

        for (const image of equippedImages) {
            if (!image) continue
            // Check if the user owns an NFT that has this image
            const ownsItem = ownedNFTs.some(nft => nft.image === image)
            if (!ownsItem) {
                return NextResponse.json(
                    { error: "You cannot equip items you do not own. Missing NFT ownership for an equipped item." },
                    { status: 403 }
                )
            }
        }

        // Generate unique content ID
        const contentId = `outfit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

        const properties = [
            { key: "title", value: title || "Untitled Outfit" },
            { key: "description", value: description || "" },
            { key: "equippedItems", value: JSON.stringify(equippedItems) },
            { key: "outfitType", value: outfitType || "single" },
            { key: "createdAt", value: Date.now() },
        ]

        const result = await createContent(contentId, profileId, properties)
        return NextResponse.json({ ...result, contentId })
    } catch (err: any) {
        console.error("Create outfit error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to create outfit" },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const profileId = searchParams.get("profileId") || undefined
        const page = parseInt(searchParams.get("page") || "1")
        const pageSize = parseInt(searchParams.get("pageSize") || "12")
        const requestingProfileId =
            searchParams.get("requestingProfileId") || undefined

        const result = await getContents({
            profileId,
            page,
            pageSize,
            orderBy: "created_at",
            orderDirection: "desc",
            requestingProfileId,
        })

        return NextResponse.json(result)
    } catch (err: any) {
        console.error("Get outfits error:", err)
        return NextResponse.json(
            { error: err.message || "Failed to fetch outfits" },
            { status: 500 }
        )
    }
}
