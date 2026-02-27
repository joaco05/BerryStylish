"use client"

import { useState } from "react"
import { Navbar } from "@/components/landing/navbar"
import { CharacterCanvas } from "@/components/editor/character-canvas"
import { WardrobePanel } from "@/components/editor/wardrobe-panel"
import { ShareOutfitDialog } from "@/components/social/share-outfit-dialog"
import type { ClothingCategory } from "@/lib/catalog"
import { Sparkles, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EditorPage() {
    const [equippedItems, setEquippedItems] = useState<
        Partial<Record<ClothingCategory, string>>
    >({})
    const [showShareDialog, setShowShareDialog] = useState(false)

    const handleEquip = (category: ClothingCategory, image: string | null) => {
        setEquippedItems((prev) => {
            const next = { ...prev }
            if (image === null) {
                delete next[category]
            } else {
                next[category] = image
            }
            return next
        })
    }

    const equippedCount = Object.keys(equippedItems).length

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pt-24 pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm border border-border">
                            <Sparkles className="h-4 w-4" />
                            Character Editor
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                            Style Your <span className="text-primary">Berry</span>
                        </h1>
                        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                            Mix and match NFT outfits to create your unique look.
                            {equippedCount > 0 && (
                                <span className="ml-1 text-primary font-semibold">
                                    {equippedCount} item{equippedCount !== 1 ? "s" : ""} equipped
                                </span>
                            )}
                        </p>

                        {/* Share button */}
                        {equippedCount > 0 && (
                            <div className="mt-4">
                                <Button
                                    onClick={() => setShowShareDialog(true)}
                                    className="rounded-full bg-primary text-primary-foreground font-bold gap-2 hover:bg-berry-dark shadow-lg shadow-primary/25"
                                >
                                    <Share2 className="h-4 w-4" />
                                    Share to Social
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Editor layout */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,380px] xl:grid-cols-[1fr,420px]">
                        {/* Character preview */}
                        <div className="flex items-center justify-center rounded-3xl border border-border bg-gradient-to-br from-card via-background to-card p-8 shadow-inner min-h-[500px]">
                            <CharacterCanvas equippedItems={equippedItems} />
                        </div>

                        {/* Wardrobe panel */}
                        <div className="h-[600px] lg:h-auto">
                            <WardrobePanel
                                onEquip={handleEquip}
                                equippedItems={equippedItems}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Share dialog */}
            <ShareOutfitDialog
                open={showShareDialog}
                onClose={() => setShowShareDialog(false)}
                equippedItems={equippedItems}
            />
        </>
    )
}

