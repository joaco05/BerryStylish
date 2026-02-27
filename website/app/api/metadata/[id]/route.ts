import { NextRequest, NextResponse } from "next/server"
import { getCatalogItem } from "@/lib/catalog"

/**
 * Serves NFT metadata JSON (Metaplex standard) for each catalog item.
 * Wallets fetch this to display the NFT image, name, and attributes.
 *
 * GET /api/metadata/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const item = getCatalogItem(id)

    if (!item) {
        return NextResponse.json(
            { error: "Item not found" },
            { status: 404 }
        )
    }

    // Use production domain for metadata URLs
    const origin = "https://berrystylish.social"

    const metadata = {
        name: item.name,
        symbol: "BRRY",
        description: item.description,
        image: `${origin}/sprites/${id.replace(/^(eyes-green|eyes-blue|hair-1|hair-2|hoodie-pastel|shirt|pants|skirt|shoes)/, (match) => {
            // Map catalog ID back to the sprite filename
            return match
        })}.svg`,
        // Use the direct sprite path
        external_url: origin,
        attributes: [
            {
                trait_type: "Category",
                value: item.category.charAt(0).toUpperCase() + item.category.slice(1),
            },
            {
                trait_type: "Max Supply",
                value: item.maxSupply.toString(),
            },
        ],
        properties: {
            files: [
                {
                    uri: `${origin}${item.image}`,
                    type: "image/svg+xml",
                },
            ],
            category: "image",
            creators: [
                {
                    address: process.env.NEXT_PUBLIC_TREASURY_PUBKEY || "",
                    share: 100,
                },
            ],
        },
    }

    // Override the image field with the correct sprite path
    metadata.image = `${origin}${item.image}`

    return NextResponse.json(metadata)
}
