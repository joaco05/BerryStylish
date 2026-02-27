"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Navbar } from "@/components/landing/navbar"
import { OutfitCard } from "@/components/social/outfit-card"
import { OutfitDetailModal } from "@/components/social/outfit-detail-modal"
import type { ClothingCategory } from "@/lib/catalog"
import {
    Loader2,
    User,
    UserPlus,
    UserMinus,
    ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function parseEquippedItems(
    content: any
): Partial<Record<ClothingCategory, string>> {
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

export default function ProfilePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id: targetProfileId } = use(params)
    const { publicKey, connected } = useWallet()
    const [profile, setProfile] = useState<any>(null)
    const [outfits, setOutfits] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [myProfileId, setMyProfileId] = useState<string | null>(null)
    const [isFollowing, setIsFollowing] = useState(false)
    const [followLoading, setFollowLoading] = useState(false)

    // Modal state
    const [selectedOutfit, setSelectedOutfit] = useState<any | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const updateOutfitSocialCount = useCallback(
        (contentId: string, type: "like" | "unlike" | "comment") => {
            setOutfits((prev) =>
                prev.map((item) => {
                    if (item.content?.id !== contentId) return item

                    const newSocialCounts = { ...item.socialCounts }
                    const newRequestingInfo = { ...item.requestingProfileSocialInfo }

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
                        // @ts-ignore
                        requestingProfileSocialInfo: newRequestingInfo,
                    }
                })
            )
        },
        []
    )

    // Ensure my profile exists
    useEffect(() => {
        if (connected && publicKey) {
            fetch("/api/tapestry/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    walletAddress: publicKey.toBase58(),
                    username: publicKey.toBase58().slice(0, 8),
                }),
            })
                .then((r) => r.json())
                .then((data) => setMyProfileId(data.profile?.id || data.id || null))
                .catch(() => setMyProfileId(null))
        } else {
            setMyProfileId(null)
        }
    }, [connected, publicKey])

    // Fetch target profile
    useEffect(() => {
        fetch(`/api/tapestry/profile?profileId=${targetProfileId}`)
            .then((r) => r.json())
            .then(setProfile)
            .catch(() => { })
    }, [targetProfileId])

    // Fetch outfits
    const fetchOutfits = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                profileId: targetProfileId,
                pageSize: "24",
            })
            if (myProfileId) params.set("requestingProfileId", myProfileId)

            const res = await fetch(`/api/tapestry/outfits?${params.toString()}`)
            const data = await res.json()
            if (data.contents) {
                setOutfits(data.contents)
            }
        } catch {
        } finally {
            setLoading(false)
        }
    }, [targetProfileId, myProfileId])

    useEffect(() => {
        fetchOutfits()
    }, [fetchOutfits])

    const handleFollow = async () => {
        if (!myProfileId || followLoading) return
        setFollowLoading(true)
        try {
            if (isFollowing) {
                await fetch("/api/tapestry/follow", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        startId: myProfileId,
                        endId: targetProfileId,
                    }),
                })
                setIsFollowing(false)
            } else {
                await fetch("/api/tapestry/follow", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        startId: myProfileId,
                        endId: targetProfileId,
                    }),
                })
                setIsFollowing(true)
            }
        } catch (err) {
            console.error("Follow error:", err)
        } finally {
            setFollowLoading(false)
        }
    }

    const isOwnProfile = myProfileId === targetProfileId

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pt-24 pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    {/* Back */}
                    <Link
                        href="/social"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Feed
                    </Link>

                    {/* Profile header */}
                    <div className="mb-10 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-lavender/20 border-2 border-primary/30">
                            {profile?.image ? (
                                <img
                                    src={profile.image}
                                    alt="Profile"
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="h-10 w-10 text-primary" />
                            )}
                        </div>
                        <h1 className="text-2xl font-extrabold text-foreground">
                            {profile?.username || targetProfileId.slice(0, 12) + "..."}
                        </h1>
                        {profile?.bio && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {profile.bio}
                            </p>
                        )}

                        {/* Follow button */}
                        {connected && myProfileId && !isOwnProfile && (
                            <div className="mt-4">
                                <Button
                                    onClick={handleFollow}
                                    disabled={followLoading}
                                    variant={isFollowing ? "outline" : "default"}
                                    className={`rounded-full font-bold gap-2 ${isFollowing
                                        ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                                        : "bg-primary text-primary-foreground hover:bg-berry-dark"
                                        }`}
                                >
                                    {followLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : isFollowing ? (
                                        <>
                                            <UserMinus className="h-4 w-4" />
                                            Unfollow
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4" />
                                            Follow
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Outfits */}
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-foreground mb-4">
                            Shared Outfits
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : outfits.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-sm text-muted-foreground">
                                This user hasn't shared any outfits yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {outfits.map((item: any) => (
                                <OutfitCard
                                    key={item.content?.id || Math.random()}
                                    contentId={item.content?.id || ""}
                                    title={
                                        getContentProperty(item.content, "title") ||
                                        "Untitled Outfit"
                                    }
                                    description={getContentProperty(
                                        item.content,
                                        "description"
                                    )}
                                    equippedItems={parseEquippedItems(item.content)}
                                    authorUsername={item.authorProfile?.username || "Unknown"}
                                    authorId={item.authorProfile?.id || ""}
                                    likeCount={item.socialCounts?.likeCount || 0}
                                    commentCount={item.socialCounts?.commentCount || 0}
                                    hasLiked={
                                        item.requestingProfileSocialInfo?.hasLiked || false
                                    }
                                    profileId={myProfileId}
                                    onLike={() => updateOutfitSocialCount(item.content?.id || "", "like")}
                                    onUnlike={() => updateOutfitSocialCount(item.content?.id || "", "unlike")}
                                    onClick={() => {
                                        setSelectedOutfit(item)
                                        setIsModalOpen(true)
                                    }}
                                />
                            ))}
                        </div>
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
                profileId={myProfileId}
                onLike={(id) => updateOutfitSocialCount(id, "like")}
                onUnlike={(id) => updateOutfitSocialCount(id, "unlike")}
                onCommentAdded={(id) => updateOutfitSocialCount(id, "comment")}
            />
        </>
    )
}
