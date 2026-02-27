"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { fetchOwnedNFTs, type OwnedNFT } from "@/lib/fetch-owned-nfts"
import {
    CATALOG,
    CATEGORY_LABELS,
    type ClothingCategory,
    type CatalogItem,
} from "@/lib/catalog"
import { Wallet, Loader2 } from "lucide-react"

interface WardrobePanelProps {
    onEquip: (category: ClothingCategory, image: string | null) => void
    equippedItems: Partial<Record<ClothingCategory, string>>
}

export function WardrobePanel({ onEquip, equippedItems }: WardrobePanelProps) {
    const { publicKey, connected } = useWallet()
    const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([])
    const [loading, setLoading] = useState(false)
    const [activeCategory, setActiveCategory] = useState<ClothingCategory>("eyes")

    useEffect(() => {
        if (connected && publicKey) {
            setLoading(true)
            fetchOwnedNFTs(publicKey.toBase58())
                .then(setOwnedNFTs)
                .finally(() => setLoading(false))
        } else {
            setOwnedNFTs([])
        }
    }, [connected, publicKey])

    const categories: ClothingCategory[] = ["eyes", "hair", "top", "bottom", "shoes"]

    // Only show items that the user owns
    const displayItems: CatalogItem[] = CATALOG.filter(
        (item) =>
            item.category === activeCategory &&
            ownedNFTs.some((nft) => nft.catalogItem?.id === item.id)
    )

    const isEquipped = (image: string) => equippedItems[activeCategory] === image

    return (
        <div className="flex h-full flex-col rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="flex border-b border-border bg-berry-light/5 px-4 py-3 items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">My Wardrobe</span>
            </div>

            {/* Category tabs */}
            <div className="flex gap-1 p-2 border-b border-border bg-background/50">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all ${activeCategory === cat
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:bg-berry-light/20 hover:text-foreground"
                            }`}
                    >
                        {CATEGORY_LABELS[cat]}
                    </button>
                ))}
            </div>

            {/* Items grid */}
            <div className="flex-1 overflow-y-auto p-3">
                {!connected ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-muted/20 rounded-xl border border-border/50">
                        <Wallet className="h-10 w-10 text-muted-foreground/40 mb-3" />
                        <p className="text-sm font-bold text-foreground mb-1">Wallet Disconnected</p>
                        <p className="text-xs text-muted-foreground max-w-[200px]">
                            Connect your wallet to equip items from your inventory.
                        </p>
                    </div>
                ) : loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : displayItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-muted/20 rounded-xl border border-border/50">
                        <p className="text-sm font-semibold text-muted-foreground mb-2">
                            No items in this category
                        </p>
                        <p className="text-xs text-muted-foreground/70 max-w-[220px]">
                            Visit the Store or Launchpad to collect new outfits to style your Berry.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {displayItems.map((item) => {
                            const equipped = isEquipped(item.image)
                            return (
                                <button
                                    key={item.id}
                                    onClick={() =>
                                        onEquip(item.category, equipped ? null : item.image)
                                    }
                                    className={`group relative rounded-xl border-2 p-2 transition-all hover:shadow-lg ${equipped
                                        ? "border-primary bg-berry-light/20 shadow-md ring-2 ring-primary/20"
                                        : "border-border hover:border-primary/40 bg-background"
                                        }`}
                                >
                                    <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-berry-light/10 to-sky/10">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-contain p-1 transition-transform group-hover:scale-110"
                                            draggable={false}
                                        />
                                    </div>
                                    <p className="mt-1.5 text-xs font-bold text-foreground truncate">
                                        {item.name}
                                    </p>
                                    {equipped && (
                                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                            <span className="text-[10px] text-primary-foreground">✓</span>
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Unequip button */}
            {equippedItems[activeCategory] && (
                <div className="border-t border-border p-3">
                    <button
                        onClick={() => onEquip(activeCategory, null)}
                        className="w-full rounded-xl border border-destructive/30 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        Remove {CATEGORY_LABELS[activeCategory]}
                    </button>
                </div>
            )}
        </div>
    )
}
