"use client"

import { FolderOpen, User } from "lucide-react"
import { OutfitPreview } from "./outfit-preview"
import type { ClothingCategory } from "@/lib/catalog"

interface CollectionCardProps {
    contentId: string
    name: string
    description?: string
    outfitCount: number
    authorUsername: string
    authorId: string
    // First outfit items to show as cover
    coverOutfitItems?: Partial<Record<ClothingCategory, string>>
    onClick?: (contentId: string) => void
    onAuthorClick?: (authorId: string) => void
}

export function CollectionCard({
    contentId,
    name,
    description,
    outfitCount,
    authorUsername,
    authorId,
    coverOutfitItems,
    onClick,
    onAuthorClick,
}: CollectionCardProps) {
    return (
        <div
            onClick={() => onClick?.(contentId)}
            className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 cursor-pointer"
        >
            {/* Cover */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-berry-light/15 via-background to-lavender/15 flex items-center justify-center p-4">
                {coverOutfitItems && Object.keys(coverOutfitItems).length > 0 ? (
                    <OutfitPreview equippedItems={coverOutfitItems} size="sm" />
                ) : (
                    <FolderOpen className="h-12 w-12 text-muted-foreground/30" />
                )}

                {/* Count badge */}
                <div className="absolute top-3 right-3 rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-primary-foreground">
                    {outfitCount} outfit{outfitCount !== 1 ? "s" : ""}
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="text-sm font-extrabold text-foreground truncate mb-1">
                    {name}
                </h3>
                {description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {description}
                    </p>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onAuthorClick?.(authorId)
                    }}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-3 w-3 text-primary" />
                    </div>
                    <span className="font-semibold truncate max-w-[120px]">
                        {authorUsername}
                    </span>
                </button>
            </div>
        </div>
    )
}
