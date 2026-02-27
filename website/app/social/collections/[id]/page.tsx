"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@/components/user-provider"
import { Navbar } from "@/components/landing/navbar"
import { OutfitCard } from "@/components/social/outfit-card"
import { OutfitDetailModal } from "@/components/social/outfit-detail-modal"
import type { ClothingCategory } from "@/lib/catalog"
import {
    Loader2,
    FolderOpen,
    ArrowLeft,
    User as UserIcon,
    AlertCircle,
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

function parseEquippedItems(content: any): Partial<Record<ClothingCategory, string>> {
    try {
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
    if (content[key]) return String(content[key])
    if (content.properties) {
        const prop = content.properties.find?.((p: any) => p.key === key)
        return prop?.value ? String(prop.value) : ""
    }
    return ""
}

export default function CollectionDetailPage() {
    const params = useParams()
    // In Next 13/14 app router, params can be a Promise
    const id = params?.id as string
    const { profileId } = useUser()
    const router = useRouter()

    const [collection, setCollection] = useState<any | null>(null)
    const [outfits, setOutfits] = useState<OutfitContent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Modal state
    const [selectedOutfit, setSelectedOutfit] = useState<OutfitContent | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchCollectionData = useCallback(async () => {
        if (!id) return
        setLoading(true)
        setError(null)
        try {
            // 1. Fetch collection metadata
            const res = await fetch(`/api/tapestry/outfits/${id}`)
            if (!res.ok) {
                if (res.status === 404) throw new Error("Collection not found")
                throw new Error(`Failed to fetch collection: ${res.status}`)
            }
            const data = await res.json()
            setCollection(data)

            // 2. Parse outfit IDs
            const outfitIdsStr = getContentProperty(data.content, "outfitIds")
            let outfitIds: string[] = []
            try {
                outfitIds = outfitIdsStr ? JSON.parse(outfitIdsStr) : []
            } catch (e) {
                console.error("Failed to parse outfitIds", e)
            }

            if (outfitIds.length > 0) {
                // 3. Fetch each outfit details
                const outfitPromises = outfitIds.map(async (oid) => {
                    try {
                        const url = `/api/tapestry/outfits/${oid}${profileId ? `?requestingProfileId=${profileId}` : ""}`
                        const outfitRes = await fetch(url)
                        if (outfitRes.ok) return await outfitRes.json()
                        return null
                    } catch { return null }
                })
                const outfitsData = await Promise.all(outfitPromises)
                setOutfits(outfitsData.filter(o => o !== null))
            }
        } catch (err: any) {
            console.error("Error fetching collection:", err)
            setError(err.message || "Failed to load collection")
        } finally {
            setLoading(false)
        }
    }, [id, profileId])

    useEffect(() => {
        fetchCollectionData()
    }, [fetchCollectionData])

    const updateOutfitSocialCount = (contentId: string, type: "like" | "unlike" | "comment") => {
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
    }

    const title = getContentProperty(collection?.content, "title") || "Untitled Collection"
    const description = getContentProperty(collection?.content, "description")
    const authorUsername = collection?.authorProfile?.username || "Unknown"

    if (!id) return null

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pt-24 pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    {/* Back link */}
                    <Link
                        href="/social/collections"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Collections
                    </Link>

                    {loading && outfits.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                            <p className="text-sm text-muted-foreground font-semibold">
                                Loading gallery...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <AlertCircle className="h-16 w-16 text-destructive/20 mb-4" />
                            <h3 className="text-lg font-bold text-foreground mb-2">
                                Something went wrong
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm mb-6">
                                {error}
                            </p>
                            <Button onClick={fetchCollectionData} variant="outline" className="rounded-full">
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="mb-12">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/50">
                                    <div className="max-w-2xl">
                                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary border border-primary/20">
                                            <FolderOpen className="h-3 w-3" />
                                            Collection
                                        </div>
                                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4">
                                            {title}
                                        </h1>
                                        {description && (
                                            <p className="text-muted-foreground text-lg">
                                                {description}
                                            </p>
                                        )}

                                        <div className="mt-6 flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                                                <UserIcon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-tight">Curated by</span>
                                                <span className="text-sm font-bold text-foreground leading-tight">{authorUsername}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm font-bold bg-card border border-border rounded-2xl p-4 shadow-sm">
                                        <div className="text-center px-4 border-r border-border">
                                            <div className="text-2xl text-primary">{outfits.length}</div>
                                            <div className="text-[10px] uppercase text-muted-foreground">Outfits</div>
                                        </div>
                                        <div className="text-center px-4">
                                            <div className="text-2xl text-foreground">
                                                {collection?.socialCounts?.likeCount || 0}
                                            </div>
                                            <div className="text-[10px] uppercase text-muted-foreground">Likes</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feed */}
                            {outfits.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 text-center">
                                    <FolderOpen className="h-16 w-16 text-muted-foreground/20 mb-4" />
                                    <h3 className="text-lg font-bold text-foreground mb-2">
                                        No outfits in this gallery yet!
                                    </h3>
                                    <p className="text-sm text-muted-foreground max-w-sm">
                                        The curator hasn't added any looks here yet.
                                    </p>
                                </div>
                            ) : (
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
                            )}
                        </>
                    )}
                </div>
            </main>

            <OutfitDetailModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setTimeout(() => setSelectedOutfit(null), 200)
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
