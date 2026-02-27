import type { CatalogItem } from "./catalog"

/**
 * Mints a compressed NFT by calling the server-side API route.
 * The server uses the tree creator keypair as the minting authority,
 * and sets the user's wallet as the leafOwner (recipient).
 */
export async function mintCompressedNFT(
    leafOwnerPublicKey: string,
    item: CatalogItem
) {
    const response = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            itemId: item.id,
            itemName: item.name,
            leafOwner: leafOwnerPublicKey,
        }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || "Minting failed")
    }

    return data
}
