import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"
import { publicKey as umiPublicKey } from "@metaplex-foundation/umi"
import type { CatalogItem, ClothingCategory } from "./catalog"
import { CATALOG } from "./catalog"

export interface OwnedNFT {
    assetId: string
    name: string
    image: string
    catalogItem: CatalogItem | null
    category: ClothingCategory | null
}

export async function fetchOwnedNFTs(
    ownerPublicKey: string
): Promise<OwnedNFT[]> {
    const dasUrl =
        process.env.NEXT_PUBLIC_DAS_URL ||
        process.env.NEXT_PUBLIC_RPC_URL ||
        "https://api.devnet.solana.com"

    const umi = createUmi(dasUrl).use(dasApi())

    const treeAddress = process.env.NEXT_PUBLIC_MERKLE_TREE || ""

    try {
        const assets = await (umi.rpc as any).getAssetsByOwner({
            owner: umiPublicKey(ownerPublicKey),
            limit: 1000,
        })

        if (!assets || !assets.items) return []

        // Filter to only BerryStylish items (those from our merkle tree)
        const berryItems: OwnedNFT[] = assets.items
            .filter((asset: any) => {
                if (!treeAddress) return true // If no tree configured, show all
                return asset.compression?.tree === treeAddress
            })
            .map((asset: any) => {
                const name = asset.content?.metadata?.name || "Unknown"
                const image = asset.content?.links?.image || ""

                // Try to match to catalog item by name
                const catalogItem =
                    CATALOG.find((c) => c.name === name) || null

                return {
                    assetId: asset.id,
                    name,
                    image: catalogItem?.image || image,
                    catalogItem,
                    category: catalogItem?.category || null,
                }
            })

        return berryItems
    } catch (error) {
        console.error("Error fetching owned NFTs:", error)
        return []
    }
}
