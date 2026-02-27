"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, User } from "lucide-react"
import type { ClothingCategory } from "@/lib/catalog"
import { OutfitPreview } from "./outfit-preview"

interface OutfitCardProps {
    contentId: string
    title: string
    description?: string
    equippedItems: Partial<Record<ClothingCategory, string>>
    authorUsername: string
    authorId: string
    likeCount: number
    commentCount: number
    hasLiked?: boolean
    profileId?: string | null
    onLike?: (contentId: string) => void
    onUnlike?: (contentId: string) => void
    onClick?: (contentId: string) => void
    onAuthorClick?: (authorId: string) => void
}

export function OutfitCard({
    contentId,
    title,
    description,
    equippedItems,
    authorUsername,
    authorId,
    likeCount: initialLikeCount,
    commentCount,
    hasLiked: initialHasLiked = false,
    profileId,
    onLike,
    onUnlike,
    onClick,
    onAuthorClick,
}: OutfitCardProps) {
    const [liked, setLiked] = useState(initialHasLiked)
    const [likeCount, setLikeCount] = useState(initialLikeCount)
    const [isLiking, setIsLiking] = useState(false)

    // Sync from props if they change externally (e.g. from modal interactions)
    useEffect(() => {
        setLiked(initialHasLiked)
        setLikeCount(initialLikeCount)
    }, [initialHasLiked, initialLikeCount])

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!profileId || isLiking) return

        setIsLiking(true)
        const wasLiked = liked
        const wasLikeCount = likeCount

        try {
            if (wasLiked) {
                setLiked(false)
                setLikeCount((c) => Math.max(0, c - 1))
                const res = await fetch(`/api/tapestry/outfits/${contentId}/like`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profileId }),
                })
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}))
                    throw new Error(data.error || "Failed to unlike")
                }
                onUnlike?.(contentId)
            } else {
                setLiked(true)
                setLikeCount((c) => c + 1)
                const res = await fetch(`/api/tapestry/outfits/${contentId}/like`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profileId }),
                })
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}))
                    throw new Error(data.error || "Failed to like")
                }
                onLike?.(contentId)
            }
        } catch (err) {
            // Revert on error
            setLiked(wasLiked)
            setLikeCount(wasLikeCount)
        } finally {
            setIsLiking(false)
        }
    }

    return (
        <div
            onClick={() => onClick?.(contentId)}
            className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 cursor-pointer"
        >
            {/* Outfit Preview */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-berry-light/10 via-background to-lavender/10 flex items-center justify-center p-4">
                <OutfitPreview equippedItems={equippedItems} size="md" />
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="text-sm font-extrabold text-foreground truncate mb-1">
                    {title}
                </h3>
                {description && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
                        {description}
                    </p>
                )}

                {/* Author + Social */}
                <div className="flex items-center justify-between">
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
                        <span className="font-semibold truncate max-w-[80px]">
                            {authorUsername}
                        </span>
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLike}
                            disabled={!profileId || isLiking}
                            className={`flex items-center gap-1 text-xs transition-colors ${liked
                                ? "text-rose-500"
                                : "text-muted-foreground hover:text-rose-500"
                                } ${!profileId ? "opacity-50 cursor-default" : ""}`}
                        >
                            <Heart
                                className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`}
                            />
                            <span className="font-bold">{likeCount}</span>
                        </button>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span className="font-bold">{commentCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
