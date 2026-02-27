"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useUser } from "@/components/user-provider"
import { Navbar } from "@/components/landing/navbar"
import { OutfitCard } from "@/components/social/outfit-card"
import { OutfitDetailModal } from "@/components/social/outfit-detail-modal"
import type { ClothingCategory } from "@/lib/catalog"
import {
    Loader2,
    Sparkles,
    Users,
    FolderOpen,
    RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface OutfitContent {
    content: {
        id: string
        created_at: number
        namespace: string
    } | null
    socialCounts: {
        likeCount: number
        commentCount: number
    }
    authorProfile: {
        id: string
        username: string
        bio?: string | null
        image?: string | null
    }
    requestingProfileSocialInfo?: {
        hasLiked: boolean
    }
}

function parseEquippedItems(
    content: any
): Partial<Record<ClothingCategory, string>> {
    try {
        // Content properties are stored as key-value pairs
        // They might be on the content directly, or we need to parse from properties
        if (content?.equippedItems) {
            return typeof content.equippedItems === "string"
                ? JSON.parse(content.equippedItems)
                : content.equippedItems
        }
        return {}
    } catch {
        return {}
    }
}

function getContentProperty(content: any, key: string): string {
    if (!content) return ""
    // Content properties might be stored differently depending on Tapestry response format
    if (content[key]) return String(content[key])
    if (content.properties) {
        const prop = content.properties.find?.((p: any) => p.key === key)
        return prop?.value ? String(prop.value) : ""
    }
    return ""
}

export default function SocialFeedPage() {
    const { publicKey, connected } = useWallet()
    const { profileId } = useUser()
    const [outfits, setOutfits] = useState<OutfitContent[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const pageSize = 12

    // Modal state
    const [selectedOutfit, setSelectedOutfit] = useState<OutfitContent | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const updateOutfitSocialCount = useCallback(
        (contentId: string, type: "like" | "unlike" | "comment") => {
            setOutfits((prev) =>
                prev.map((item) => {
                    if (item.content?.id !== contentId) return item

                    const newSocialCounts = { ...item.socialCounts }
                    let newRequestingInfo = item.requestingProfileSocialInfo
                        ? { ...item.requestingProfileSocialInfo }
                        : { hasLiked: false }

                    if (type === "like") {
                        newSocialCounts.likeCount = (newSocialCounts.likeCount || 0) + 1
                        newRequestingInfo.hasLiked = true
                    } else if (type === "unlike") {
                        newSocialCounts.likeCount = Math.max(0, (newSocialCounts.likeCount || 0) - 1)
                        newRequestingInfo.hasLiked = false
                    } else if (type === "comment") {
                        newSocialCounts.commentCount = (newSocialCounts.commentCount || 0) + 1
                    }

                    return {
                        ...item,
                        socialCounts: newSocialCounts,
                        requestingProfileSocialInfo: newRequestingInfo,
                    }
                })
            )
        },
        []
    )



    const fetchOutfits = useCallback(
        async (pageNum: number) => {
            setLoading(true)
            try {
                const params = new URLSearchParams({
                    page: String(pageNum),
                    pageSize: String(pageSize),
                })
                if (profileId) params.set("requestingProfileId", profileId)

                const res = await fetch(`/api/tapestry/feed?${params.toString()}`)
                const data = await res.json()

                if (data.contents) {
                    if (pageNum === 1) {
                        setOutfits(data.contents)
                    } else {
                        setOutfits((prev) => [...prev, ...data.contents])
                    }
                    setHasMore(data.contents.length === pageSize)
                }
            } catch (err) {
                console.error("Failed to fetch feed:", err)
            } finally {
                setLoading(false)
            }
        },
        [profileId]
    )

    useEffect(() => {
        fetchOutfits(1)
    }, [fetchOutfits])

    const handleLoadMore = () => {
        const nextPage = page + 1
        setPage(nextPage)
        fetchOutfits(nextPage)
    }

    const handleRefresh = () => {
        setPage(1)
        fetchOutfits(1)
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pt-24 pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    {/* Header */}
                    <div className="mb-10 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm border border-border">
                            <Sparkles className="h-4 w-4" />
                            Social Feed
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                            Community{" "}
                            <span className="text-primary">Outfits</span>
                        </h1>
                        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                            Discover amazing outfits shared by the BerryStylish community.
                            Like, comment, and get inspired!
                        </p>
                    </div>

                    {/* Quick links */}
                    <div className="mb-8 flex flex-wrap justify-center gap-3">
                        <Link href="/social/collections">
                            <Button
                                variant="outline"
                                className="rounded-full font-bold gap-2"
                            >
                                <FolderOpen className="h-4 w-4" />
                                Collections
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="rounded-full font-bold gap-2"
                            onClick={handleRefresh}
                        >
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                        </Button>
                    </div>

                    {/* Feed */}
                    {loading && outfits.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                            <p className="text-sm text-muted-foreground font-semibold">
                                Loading outfits...
                            </p>
                        </div>
                    ) : outfits.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <Users className="h-16 w-16 text-muted-foreground/20 mb-4" />
                            <h3 className="text-lg font-bold text-foreground mb-2">
                                No outfits yet!
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Be the first to share an outfit! Head to the{" "}
                                <Link
                                    href="/editor"
                                    className="text-primary hover:underline font-semibold"
                                >
                                    Character Editor
                                </Link>{" "}
                                to create and share your look.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {outfits.map((item) => {
                                    const equippedItems = parseEquippedItems(item.content)
                                    const title =
                                        getContentProperty(item.content, "title") ||
                                        "Untitled Outfit"

                                    return (
                                        <OutfitCard
                                            key={item.content?.id || Math.random()}
                                            contentId={item.content?.id || ""}
                                            title={title}
                                            description={getContentProperty(
                                                item.content,
                                                "description"
                                            )}
                                            equippedItems={equippedItems}
                                            authorUsername={item.authorProfile?.username || "Unknown"}
                                            authorId={item.authorProfile?.id || ""}
                                            likeCount={item.socialCounts?.likeCount || 0}
                                            commentCount={item.socialCounts?.commentCount || 0}
                                            hasLiked={
                                                item.requestingProfileSocialInfo?.hasLiked || false
                                            }
                                            profileId={profileId}
                                            onLike={() => updateOutfitSocialCount(item.content?.id || "", "like")}
                                            onUnlike={() => updateOutfitSocialCount(item.content?.id || "", "unlike")}
                                            onClick={() => {
                                                setSelectedOutfit(item)
                                                setIsModalOpen(true)
                                            }}
                                        />
                                    )
                                })}
                            </div>

                            {/* Load more */}
                            {hasMore && (
                                <div className="mt-10 text-center">
                                    <Button
                                        onClick={handleLoadMore}
                                        disabled={loading}
                                        variant="outline"
                                        className="rounded-full font-bold px-8"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            "Load More"
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <OutfitDetailModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setTimeout(() => setSelectedOutfit(null), 200) // Clear after animation
                }}
                outfit={selectedOutfit}
                profileId={profileId}
                onLike={(id) => updateOutfitSocialCount(id, "like")}
                onUnlike={(id) => updateOutfitSocialCount(id, "unlike")}
                onCommentAdded={(id) => updateOutfitSocialCount(id, "comment")}
            />
        </>
    )
}
